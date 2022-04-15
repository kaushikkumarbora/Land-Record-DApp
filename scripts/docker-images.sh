#!/bin/bash
set -eu

dockerFabricPull() {
  local FABRIC_TAG=$1
  for IMAGES in peer orderer ccenv; do
      echo "==> FABRIC IMAGE: $IMAGES"
      echo
      docker pull hyperledger/fabric-$IMAGES:$FABRIC_TAG
      docker tag hyperledger/fabric-$IMAGES:$FABRIC_TAG hyperledger/fabric-$IMAGES
  done
}

dockerCaPull() {
      local CA_TAG=$1
      echo "==> FABRIC CA IMAGE"
      echo
      docker pull hyperledger/fabric-ca:$CA_TAG
      docker tag hyperledger/fabric-ca:$CA_TAG hyperledger/fabric-ca
}

BUILD=
DOWNLOAD=
if [ $# -eq 0 ]; then
    BUILD=true
    PUSH=true
    DOWNLOAD=true
else
    for arg in "$@"
        do
            if [ $arg == "build" ]; then
                BUILD=true
            fi
            if [ $arg == "download" ]; then
                DOWNLOAD=true
            fi
    done
fi

if [ $DOWNLOAD ]; then
    : ${CA_TAG:="latest"}
    : ${FABRIC_TAG:="latest"}

    echo "===> Pulling fabric Images"
    dockerFabricPull ${FABRIC_TAG}

    echo "===> Pulling fabric ca Image"
    dockerCaPull ${CA_TAG}
    echo
    echo "===> List out hyperledger docker images"
    docker images | grep hyperledger*
fi

if [ $BUILD ];
    then
    echo '############################################################'
    echo '#                 BUILDING CONTAINER IMAGES                #'
    echo '############################################################'
    docker build -t orderer:latest image/orderer/
    docker build -t insurance-peer:latest image/insurancePeer/
    docker build -t appraiser-peer:latest image/appraiserPeer/
    docker build -t audit-peer:latest image/auditPeer/
    docker build -t bank-peer:latest image/bankPeer/
    docker build -t fico-peer:latest image/ficoPeer/
    docker build -t registry-peer:latest image/registryPeer/
    docker build -t title-peer:latest image/titlePeer/
    # docker build -t web:latest web/
    docker build -t insurance-ca:latest image/insuranceCA/
    docker build -t police-ca:latest image/policeCA/
    docker build -t audit-ca:latest image/auditCA/
    docker build -t bank-ca:latest image/bankCA/
    docker build -t title-ca:latest image/titleCA/
    docker build -t registry-ca:latest image/registryCA/
    docker build -t fico-ca:latest image/ficoCA/
fi
