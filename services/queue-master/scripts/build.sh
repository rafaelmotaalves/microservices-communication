#!/usr/bin/env bash

set -ev

SCRIPT_DIR=$(dirname "$0")

if [[ -z "$GROUP" ]] ; then
    echo "Cannot find GROUP env var"
    exit 1
fi

if [[ -z "$COMMIT" ]] ; then
    echo "Cannot find COMMIT env var"
    exit 1
fi

ODE_DIR=$(cd $SCRIPT_DIR/..; pwd)
echo $CODE_DIR
docker run --rm -v $HOME/.m2:/root/.m2 -v $CODE_DIR:/usr/src/mymaven -w /usr/src/mymaven maven:3.2-jdk-8 mvn -DskipTests package

cp $CODE_DIR/target/*.jar $CODE_DIR/docker/$(basename $CODE_DIR)

eval $(minikube docker-env)

for m in ./docker/*/; do
    REPO=${GROUP}/$(basename $m)
    docker build -t ${REPO}:${COMMIT} $CODE_DIR/$m;
done;

exit
