const fs = require('fs');
const { exec } = require('child_process');

function reassignPartitions(boostrapServer, topicName, reassignments) {
    const reassignmentJson = generatePartitionReassignmentJson(reassignments, topicName);

    fs.writeFileSync("/tmp/reassignment.json", JSON.stringify(reassignmentJson));

    return executeKafkaScript(boostrapServer);
}

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

function executeKafkaScript(bootstrapServer) {
    return new Promise((resolve, reject) =>
        exec(`/bin/bash kafka/bin/kafka-reassign-partitions.sh --bootstrap-server ${bootstrapServer} --reassignment-json-file /tmp/reassignment.json --execute` , function(error, stdout, stderr) {
                if (error) {
                    return reject(error);
                }
                if (stderr) {
                    return reject(stderr);
                }
                return resolve(stdout);
            }));
}

module.exports = {
    reassignPartitions
}
