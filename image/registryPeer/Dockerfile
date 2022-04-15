FROM docker.io/hyperledger/fabric-peer:latest

RUN mkdir /peer
RUN mkdir /peer/crypto
COPY artifacts/crypto-config/peerOrganizations/registry-org/peers/registry-peer/msp /peer/crypto
COPY artifacts/crypto-config/peerOrganizations/registry-org/peers/registry-peer/tls /peer/crypto
