FROM docker.io/hyperledger/fabric-peer:latest

RUN mkdir /peer
RUN mkdir /peer/crypto
COPY artifacts/crypto-config/peerOrganizations/appraiser-org/peers/appraiser-peer/msp /peer/crypto
COPY artifacts/crypto-config/peerOrganizations/appraiser-org/peers/appraiser-peer/tls /peer/crypto
