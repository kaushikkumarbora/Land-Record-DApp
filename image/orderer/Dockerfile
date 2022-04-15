FROM docker.io/hyperledger/fabric-orderer:latest

RUN mkdir /orderer
RUN mkdir /orderer/crypto
COPY artifacts/crypto-config/ordererOrganizations/orderer-org/orderers/orderer0/msp /orderer/crypto
COPY artifacts/crypto-config/ordererOrganizations/orderer-org/orderers/orderer0/tls /orderer/crypto
COPY artifacts/orderer/genesis.block orderer/crypto
