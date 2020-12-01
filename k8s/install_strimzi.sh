helm repo add strimzi https://strimzi.io/charts/

helm install strimzi/strimzi-kafka-operator --namespace comm-infra --generate-name
