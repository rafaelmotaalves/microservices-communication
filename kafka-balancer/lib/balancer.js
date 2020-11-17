function balancePartitions(brokers, partitions) {
    const totalPartitionQuantity = partitions.length;
    const brokersWithAllocatedPartitions = groupPartitionsByBroker(brokers, partitions);

    return generateOptimalPartitionAllocation(brokersWithAllocatedPartitions, totalPartitionQuantity);
}

function groupPartitionsByBroker(brokers, partitions) {
    const brokersWithAllocatedPartitions = brokers.map(({ nodeId }) => {
        const allocatedPartitions = partitions.filter(partition => partition.leader === nodeId)

        return { nodeId, partitions: allocatedPartitions }
    });

    brokersWithAllocatedPartitions.sort((a, b) => b.partitions.length - a.partitions.length);

    return brokersWithAllocatedPartitions;
}

function generateOptimalPartitionAllocation(partitionsGroupedByBroker, totalPartitionQuantity) {
    const expectedPartitionQuantity = Math.floor(totalPartitionQuantity / partitionsGroupedByBroker.length)
    let unallocatedPartitions = [];

    return partitionsGroupedByBroker.map(broker => {
        if (broker.partitions.length > expectedPartitionQuantity) {
            // if the broker has more partitions than expected, add the spare partitions
            // to unallocated partitions
            unallocatedPartitions = unallocatedPartitions.concat(
                broker.partitions.slice(expectedPartitionQuantity, broker.partitions.length)
            );

            return { nodeId: broker.nodeId, addedPartitions: [] };
        } else if (broker.partitions.length < expectedPartitionQuantity) {
            // if the broker has less partitions than expected, get the needed partitions
            // from the unallocated partitions list
            const quantityNeeded = expectedPartitionQuantity - broker.partitions.length
            const addedPartitions = unallocatedPartitions.splice(0, quantityNeeded)

            return { nodeId: broker.nodeId, addedPartitions };
        }
   });
}

module.exports = {
    balancePartitions
};
