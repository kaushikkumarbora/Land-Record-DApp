FROM docker.io/hyperledger/fabric-peer:latest

RUN mkdir /peer
RUN mkdir /peer/crypto
COPY artifacts/crypto-config/peerOrganizations/title-org/peers/title-peer/msp /peer/crypto
COPY artifacts/crypto-config/peerOrganizations/title-org/peers/title-peer/tls /peer/crypto
