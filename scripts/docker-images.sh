#!/bin/bash
set -eu

dockerFabricPull() {
  local FABRIC_TAG=$1
  for IMAGES in peer orderer ccenv; do
      echo "==> FABRIC IMAGE: $IMAGES"
      echo
      docker pull hyperledger/fabric-$IMAGES:$FABRIC_TAG
  done
}

dockerCaPull() {
      local CA_TAG=$1
      echo "==> FABRIC CA IMAGE"
      echo
      docker pull hyperledger/fabric-ca:$CA_TAG
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
    : ${CA_TAG:="1.5.2"}
    : ${FABRIC_TAG:="2.2.5"}

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
    docker build -t municipal-peer:latest image/municipalPeer/
    docker build -t appraiser-peer:latest image/appraiserPeer/
    docker build -t audit-peer:latest image/auditPeer/
    docker build -t bank-peer:latest image/bankPeer/
    docker build -t fico-peer:latest image/ficoPeer/
    docker build -t registry-peer:latest image/registryPeer/
    docker build -t revenue-peer:latest image/revenuePeer/
    # docker build -t web:latest web/
    docker build -t orderer-ca:latest image/ordererCA/
    docker build -t insurance-ca:latest image/insuranceCA/
    docker build -t municipal-ca:latest image/municipalCA/
    docker build -t appraiser-ca:latest image/appraiserCA/
    docker build -t audit-ca:latest image/auditCA/
    docker build -t bank-ca:latest image/bankCA/
    docker build -t revenue-ca:latest image/revenueCA/
    docker build -t registry-ca:latest image/registryCA/
    docker build -t fico-ca:latest image/ficoCA/
fi
