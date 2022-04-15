FROM docker.io/hyperledger/fabric-ca:latest

RUN mkdir /ca
COPY fabric-ca-server-config.yaml /ca
COPY artifacts/crypto-config/peerOrganizations/audit-org/tlsca /ca/tls
COPY artifacts/crypto-config/peerOrganizations/audit-org/ca /ca/ca
RUN ["mv", "/ca/ca/*_sk", "/ca/ca/key.pem"]
RUN ["mv", "/ca/ca/*-cert.pem", "/ca/ca/cert.pem"]
RUN ["mv", "/ca/tls/*_sk", "/ca/tls/key.pem"]
RUN ["mv", "/ca/tls/*-cert.pem", "/ca/tls/cert.pem"]
