FROM docker.io/hyperledger/fabric-orderer:2.2.5

RUN mkdir /orderer
RUN mkdir /orderer/crypto
COPY msp /orderer/crypto/msp
COPY tls /orderer/crypto/tls
COPY genesis.block orderer/crypto
