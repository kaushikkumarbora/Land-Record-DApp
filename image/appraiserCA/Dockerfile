FROM docker.io/hyperledger/fabric-ca:latest
RUN mkdir /ca
COPY fabric-ca-server-config.yaml /ca
COPY tlsca /ca/tls
COPY ca /ca/ca
