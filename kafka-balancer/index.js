const { Kafka } = require('kafkajs')

const KafkaWrapper = require('./lib/kafkaWrapper');
const { balancePartitions } = require('./lib/balancer');
const { reassignPartitions } = require('./lib/kafka-reassign-partititions');

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

        const partitionsReassignment = balancePartitions(brokers, partitions);

        const result = await reassignPartitions(BOOTSTRAP_SERVER, TOPIC_NAME, partitionsReassignment);

        console.log(result);
    } catch (err) {
        console.log(err)
    } finally {
        await kafkaWrapper.disconnect()
    }

})()


