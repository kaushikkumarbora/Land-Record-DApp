FROM docker.io/hyperledger/fabric-peer:latest

RUN mkdir /peer
RUN mkdir /peer/crypto
COPY artifacts/crypto-config/peerOrganizations/audit-org/peers/audit-peer/msp /peer/crypto
COPY artifacts/crypto-config/peerOrganizations/audit-org/peers/audit-peer/tls /peer/crypto
