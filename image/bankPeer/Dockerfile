FROM docker.io/hyperledger/fabric-peer:2.2.5

RUN mkdir /peer
RUN mkdir /peer/crypto
COPY msp /peer/crypto/msp
COPY tls /peer/crypto/tls
