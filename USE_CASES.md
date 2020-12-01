### With the kafka cluster running execute the following steps:

1. Visualize the 1 broker executing on the kafka cluster

2. Create the topic executing the command:
    kubectl create -f kafka/topics/shipping.yaml

3. Visualize the created topic on the dashboard

4. Deploy the queue-master and the shipping services

5. Execute the ./load.sh script and visualize the metrics on the dashboard also seeing then being consumed on service logs

6. Increase the number of partitions for the topic by modifying the yaml and executing:
    kubectl apply -f kafka/topics/shipping.yaml

7. Increase the number of replicas for queue-master service

8. Execute the ./load.sh script and visualize the metrics on the dashboard also seeing then being consumed on service logs

9. Modify the cluster to increase the number of kafka brokers

10. Visualize the x brokers executing on the kafka cluster

11. Execute the kafka balancer job 

12. Check that the kafka partitions are distributed in the brokers

13. Execute the ./load.sh script and visualize the metrics on the dashboard also seeing then being consumed on service logs