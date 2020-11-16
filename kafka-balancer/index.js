const { Kafka } = require('kafkajs')
const { exec } = require("child_process")
const fs = require("fs")
const KafkaWrapper = require('./lib/kafkaWrapper')

APP_NAME = "kafka-balancer";
BOOTSTRAP_SERVER = process.env.BOOTSTRAP_SERVER;
TOPIC_NAME = process.env.TOPIC_NAME;

const kafka = new Kafka({
    clientId: APP_NAME,
    brokers: [BOOTSTRAP_SERVER]
});

(async function () {
    const kafkaWrapper = new KafkaWrapper(kafka, TOPIC_NAME)
    try {
        const brokers = await kafkaWrapper.getBrokers();
        const partitions = await kafkaWrapper.getPartitions();
    
        const partitionsReassignment = generateKafkaPartitionReassignment(brokers, partitions);
        const reassignmentJson = generatePartitionReassignmentJson(partitionsReassignment, TOPIC_NAME)
        
        if (reassignmentJson.partitions.length === 0) {
            console.log("Partition assignment is already optimal");
            return;
        }

        fs.writeFileSync("/tmp/reassignment.json", JSON.stringify(reassignmentJson));
        
        const result = await new Promise((resolve, reject) => exec(`/bin/bash kafka/bin/kafka-reassign-partitions.sh --bootstrap-server ${BOOTSTRAP_SERVER} --reassignment-json-file /tmp/reassignment.json --execute` , function(error, stdout, stderr) {
            if (error) {
                return reject(error);
            }
            if (stderr) {
                return reject(stderr);
            }
            return resolve(stdout);
        }));
        console.log(result);
    } catch (err) {
        console.log(err)
    } finally {
        await kafkaWrapper.disconnect()
    }

})()

function generatePartitionReassignmentJson(partitionsReassignment, topicName) {
    const partitions = []
    
    partitionsReassignment.forEach(broker => {
        broker.addedPartitions.forEach(partition => {
            partitions.push({
                topic: topicName,
                partition: partition.partitionId,
                replicas: [broker.nodeId]
            })
        });
    });

    return {
        version: 1,
        partitions
    }
}

function generateKafkaPartitionReassignment(brokers, partitions) {
    const brokersWithAllocatedPartitions = brokers.map(({ nodeId }) => {
        const allocatedPartitions = partitions.filter(partition => partition.leader === nodeId)

        return { nodeId, partitions: allocatedPartitions }
    }); 
    brokersWithAllocatedPartitions.sort((a, b) => b.partitions.length - a.partitions.length);

    const totalPartitionQuantity = partitions.length;
    const expectedPartitionQuantity = Math.floor(totalPartitionQuantity / brokers.length)
    let unallocatedPartitions = [];
    
    const brokersWithNewAllocation = brokersWithAllocatedPartitions.map(broker => {
        let newAllocatedPartitions = broker.partitions
        let addedPartitions = [];        
        if (broker.partitions.length > expectedPartitionQuantity) {
            newAllocatedPartitions = broker.partitions.slice(0, expectedPartitionQuantity);

            unallocatedPartitions = unallocatedPartitions.concat(broker.partitions.slice(expectedPartitionQuantity, broker.partitions.length));
        } else if (broker.partitions.length < expectedPartitionQuantity) {
            const quantityNeeded = expectedPartitionQuantity - broker.partitions.length
            addedPartitions = unallocatedPartitions.splice(0, quantityNeeded + 1)

            newAllocatedPartitions = broker.partitions.concat(addedPartitions)
        }

        return { nodeId: broker.nodeId, partitions: newAllocatedPartitions, addedPartitions: addedPartitions }
    });


    return brokersWithNewAllocation;
}
