function balancePartitions(brokers, partitions) {
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

module.exports = {
    balancePartitions
};
