FROM docker.io/hyperledger/fabric-ca:1.5.2
RUN mkdir /ca
COPY fabric-ca-server-config.yaml /ca
COPY tlsca /ca/tls
COPY ca /ca/ca
