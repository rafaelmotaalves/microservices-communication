eval $(minikube docker-env)

docker build . -t kafka-balancer

exit