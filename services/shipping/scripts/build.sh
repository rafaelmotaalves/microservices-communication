#!/usr/bin/env bash

set -ev

export BUILD_VERSION="0.0.2-SNAPSHOT"
export BUILD_DATE=`date +%Y-%m-%dT%T%z`

SCRIPT_DIR=$(dirname "$0")

if [[ -z "$GROUP" ]] ; then
    echo "Cannot find GROUP env var"
    exit 1
fi

if [[ -z "$COMMIT" ]] ; then
    echo "Cannot find COMMIT env var"
    exit 1
fi

CODE_DIR=$(cd $SCRIPT_DIR/..; pwd)
echo $CODE_DIR
docker run --rm -v $HOME/.m2:/root/.m2 -v $CODE_DIR:/usr/src/mymaven -w /usr/src/mymaven maven:3.2-jdk-8 mvn -DskipTests package

cp $CODE_DIR/target/*.jar $CODE_DIR/docker/$(basename $CODE_DIR)

eval $(minikube docker-env)

for m in ./docker/*/; do
    REPO=${GROUP}/$(basename $m)
	docker build \
      --build-arg BUILD_VERSION=$BUILD_VERSION \
      --build-arg BUILD_DATE=$BUILD_DATE \
      --build-arg COMMIT=$COMMIT \
      -t ${REPO}:${COMMIT} $CODE_DIR/$m;
done;

exit
