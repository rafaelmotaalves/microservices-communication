BASE_DIR="$(pwd)"

echo $BASE_DIR
cd services/shipping
GROUP=comm-infra COMMIT=1.0 ./scripts/build.sh
cd $BASE_DIR

cd services/queue-master
GROUP=comm-infra COMMIT=1.0 ./scripts/build.sh
cd $BASE_DIR

cd kafka-balancer
GROUP=comm-infra COMMIT=1.0 ./scripts/build.sh
cd $BASE_DIR