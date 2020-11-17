const { Kafka } = require('kafkajs')

const KafkaWrapper = require('./lib/kafkaWrapper');
const { balancePartitions } = require('./lib/balancer');
const { reassignPartitions } = require('./lib/kafka-reassign-partititions');

APP_NAME = "kafka-balancer";
BOOTSTRAP_SERVER = process.env.BOOTSTRAP_SERVER;

const kafka = new Kafka({
    clientId: APP_NAME,
    brokers: [BOOTSTRAP_SERVER]
});

(async function () {
    const kafkaWrapper = new KafkaWrapper(kafka);

    try {
        const topics = await kafkaWrapper.getTopics();

        for (let topic of topics) {
          const brokers = await kafkaWrapper.getBrokers();
          const partitions = await kafkaWrapper.getPartitions(topic);
          console.log(partitions); 
          const partitionsReassignment = balancePartitions(brokers, partitions);
          console.log(partitionsReassignment);
          const result = await reassignPartitions(BOOTSTRAP_SERVER, topic, partitionsReassignment);

          console.log(result);
        }
    } catch (err) {
        console.log(err)
    } finally {
        await kafkaWrapper.disconnect()
    }

})()


