FROM docker.io/hyperledger/fabric-orderer:latest

RUN mkdir /orderer
RUN mkdir /orderer/crypto
COPY msp /orderer/crypto
COPY tls /orderer/crypto
COPY genesis.block orderer/crypto
