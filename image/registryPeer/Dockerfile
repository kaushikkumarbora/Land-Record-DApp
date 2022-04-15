FROM docker.io/hyperledger/fabric-peer:latest

RUN mkdir /peer
RUN mkdir /peer/crypto
COPY msp /peer/crypto/msp
COPY tls /peer/crypto/tls
