FROM docker.io/hyperledger/fabric-peer:latest

RUN mkdir /peer
RUN mkdir /peer/crypto
COPY artifacts/crypto-config/peerOrganizations/fico-org/peers/fico-peer/msp /peer/crypto
COPY artifacts/crypto-config/peerOrganizations/fico-org/peers/fico-peer/tls /peer/crypto
