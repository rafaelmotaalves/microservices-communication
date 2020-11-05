# microservices-communication


## Deploying

With [Minikube](https://github.com/kubernetes/minikube) and [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) installed, start a cluster with the necessary memory:

```
    minikube start --memory=4096 --cpus=4
```

After the cluster has started execute the following command with to create the `sock-shop` namespace:

```
    kubectl create -f k8s/sock-shop-ns.yaml
```

After the namespace is created, you can execute the following command to spawn the rest of the containers:

```
    kubectl create -f k8s/services
```

To teardown the application you can delete the created namespace:

```
    kubectl delete -f k8s/sock-shop-ns.yaml
```