# microservices-communication


## Deploying

With [Minikube](https://github.com/kubernetes/minikube), [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) and [helm](https://helm.sh/) installed, start a cluster with the necessary memory:

```
    minikube start --memory=4096 --cpus=4
```

On the k8s/ folder follow the steps:

### To Deploy the communication infra
After the cluster has started execute the following command with to create the `comm-infra` namespace:

```
    kubectl create -f comm-infra-ns.yaml
```

To install [Strimzi](https://strimzi.io/) execute:
```
    ./install_strimzi.sh
```

To deploy kafka execute:

```
    kubectl create -f kafka/cluster.yaml
```

To create a topic execute:
```
    kubectl create -f kakfa/topics/<topic-file>
```

To teardown the application you can delete the created namespace:

```
    kubectl delete -f app/sock-shop-ns.yaml
```

### To Deploy the application

After the cluster has started execute the following command with to create the `sock-shop` namespace:

```
    kubectl create -f app/sock-shop-ns.yaml
```

After the namespace is created build the queue-master and shipping images are built, you can execute the following command to spawn the rest of the containers:


```
    kubectl create -f app/services
```

To teardown the application you can delete the created namespace:

```
    kubectl delete -f app/sock-shop-ns.yaml
```

### To Build the Services
If need to build the custom services execute, go to the service directory and execute:
```
    GROUP=comm-infra COMMIT=1.0 ./scripts/build.sh
```