FROM docker.io/hyperledger/fabric-peer:latest

RUN mkdir /peer
RUN mkdir /peer/crypto
COPY artifacts/crypto-config/peerOrganizations/insurance-org/peers/insurance-peer/msp /peer/crypto
COPY artifacts/crypto-config/peerOrganizations/insurance-org/peers/insurance-peer/tls /peer/crypto
