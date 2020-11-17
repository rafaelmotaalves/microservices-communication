module.exports = class KafkaWrapper {
    constructor(kafkaClient) {
        this.admin = kafkaClient.admin();
    }

    async getBrokers() {
        const clusterInfo = await this.admin.describeCluster();

        return clusterInfo.brokers;
    }

    async getPartitions(topicName) {
        const topicMetadata = await this.admin.fetchTopicMetadata({ topics: [topicName]});

        return topicMetadata.topics[0].partitions;
    }

    async getTopics() {
        return this.admin.listTopics();
    }

    async disconnect() {
        return this.admin.disconnect();
    }
}
