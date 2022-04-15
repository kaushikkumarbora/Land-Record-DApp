FROM docker.io/hyperledger/fabric-peer:latest

RUN mkdir /peer
RUN mkdir /peer/crypto
COPY artifacts/crypto-config/peerOrganizations/bank-org/peers/bank-peer/msp /peer/crypto
COPY artifacts/crypto-config/peerOrganizations/bank-org/peers/bank-peer/tls /peer/crypto
