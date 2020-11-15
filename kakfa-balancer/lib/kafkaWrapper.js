module.exports = class KafkaWrapper {
    constructor(kafkaClient, topicName) {
        this.admin = kafkaClient.admin();
        this.topicName = topicName;
    }

    async getBrokers() {
        const clusterInfo = await this.admin.describeCluster();

        return clusterInfo.brokers;
    }

    async getPartitions() {
        const topicMetadata = await this.admin.fetchTopicMetadata({ topics: [this.topicName]});

        return topicMetadata.topics[0].partitions;
    }

    async disconnect() {
        return this.admin.disconnect();
    }
}