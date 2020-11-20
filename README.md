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

To install the helm dependencies execute:

```
    helm dependency build
```

To deploy kafka execute:

```
    kubectl create -f kafka
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

After the namespace is created, you can execute the following command to spawn the rest of the containers:

```
    kubectl create -f app/services
```

To teardown the application you can delete the created namespace:

```
    kubectl delete -f app/sock-shop-ns.yaml
```

### To Deploy the communication monitor
```
    kubectl create namespace monitoring
```

```
    kubectl apply -f monitoring-namespace.yml
```

```
    kubectl apply -f kafka/monitoring/prometheus-setup/prometheus-operator-service-account.yaml -n monitoring
```

```
    kubectl apply -f kafka/monitoring/prometheus-setup/prometheus-operator-cluster-role.yaml -n monitoring
```

```
    kubectl apply -f kafka/monitoring/prometheus-setup/prometheus-operator-cluster-role-binding.yaml -n monitoring
```

```
    kubectl apply -f kafka/monitoring/prometheus-setup/prometheus-operator-deployment.yaml -n monitoring
```

```
    kubectl apply -f kafka/monitoring/strimzi-service-monitor.yaml -n monitoring
```

```
    kubectl apply -f kafka/monitoring/prometheus-rules.yaml -n monitoring
```

```
    kubectl create secret generic alertmanager-alertmanager --from-file=monitoring/alertmanager-setup/alertmanager.yaml -n monitoring

```
    kubectl apply -f kafka/monitoring/prometheus.yaml -n monitoring
```

```
    kubectl port-forward prometheus-prometheus-0 9090:9090 -n monitoring
```

```
    kubectl create secret generic alertmanager-alertmanager --from-file=kafka/monitoring/alertmanager-setup/alertmanager.yaml -n monitoring
```

```
    kubectl apply -f kafka/monitoring/alertmanager-setup/alert-manager.yaml
```

```
    kubectl apply -f kafka/monitoring/grafana.yaml -n monitoring
```

```
    kubectl apply -f kafka/monitoring/grafana.yaml -n monitoring
```

```
    kubectl port-forward grafana-5468f476d9-xh79f 3000:3000 -n monitoring
```