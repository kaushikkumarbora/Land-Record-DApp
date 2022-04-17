#!/bin/bash

export FABRIC_START_WAIT=3
export FABRIC_CFG_PATH=./

echo -e "\e[5;32;40mgenerating certificates in crypto-config folder for all entities\e[m "
sh clean.sh
mkdir artifacts
mkdir artifacts/crypto-config
./binaries/cryptogen generate --config crypto-config.yaml --output artifacts/crypto-config/
sleep ${FABRIC_START_WAIT}



echo -e "\e[5;32;40mgenerating genseis block\e[m "
mkdir artifacts/orderer
./binaries/configtxgen -profile LANDRECOrdererGenesis -channelID system-channel -outputBlock ./artifacts/orderer/genesis.block

echo -e "\e[5;32;40mcreate the channel configuration blocks with this configuration file, by using the other profiles\e[m "

mkdir artifacts/channels
./binaries/configtxgen -profile RecordsChannel -outputCreateChannelTx ./artifacts/channels/Records.tx -channelID records
sleep ${FABRIC_START_WAIT}
./binaries/configtxgen -profile LendingChannel -outputCreateChannelTx ./artifacts/channels/Lending.tx -channelID lending
sleep ${FABRIC_START_WAIT}
./binaries/configtxgen -profile BooksChannel -outputCreateChannelTx ./artifacts/channels/Books.tx -channelID books
sleep ${FABRIC_START_WAIT}

echo -e "\e[5;32;40mgenerate the anchor peer update transactions\e[m "


./binaries/configtxgen -profile RecordsChannel -outputAnchorPeersUpdate ./artifacts/channels/recordsanchor.tx -channelID records -asOrg RegistryMSP
sleep ${FABRIC_START_WAIT}
./binaries/configtxgen -profile LendingChannel -outputAnchorPeersUpdate ./artifacts/channels/lendinganchor.tx -channelID lending -asOrg BankMSP
sleep ${FABRIC_START_WAIT}
./binaries/configtxgen -profile BooksChannel -outputAnchorPeersUpdate ./artifacts/channels/booksanchor.tx -channelID books -asOrg AppraiserMSP

cp -r artifacts/crypto-config/ordererOrganizations/orderer-org/ca image/ordererCA
cp -r artifacts/crypto-config/ordererOrganizations/orderer-org/tlsca image/ordererCA

mv image/ordererCA/ca/priv_sk image/ordererCA/ca/key.pem
mv image/ordererCA/tlsca/priv_sk image/ordererCA/tlsca/key.pem
mv image/ordererCA/ca/*-cert.pem image/ordererCA/ca/cert.pem
mv image/ordererCA/tlsca/*-cert.pem image/ordererCA/tlsca/cert.pem

cp -r artifacts/crypto-config/ordererOrganizations/orderer-org/orderers/orderer0/msp image/orderer
cp -r artifacts/crypto-config/ordererOrganizations/orderer-org/orderers/orderer0/tls image/orderer
cp -r artifacts/orderer/genesis.block image/orderer

cp -r artifacts/crypto-config/peerOrganizations/appraiser-org/ca image/appraiserCA
cp -r artifacts/crypto-config/peerOrganizations/appraiser-org/tlsca image/appraiserCA

mv image/appraiserCA/ca/priv_sk image/appraiserCA/ca/key.pem
mv image/appraiserCA/tlsca/priv_sk image/appraiserCA/tlsca/key.pem
mv image/appraiserCA/ca/*-cert.pem image/appraiserCA/ca/cert.pem
mv image/appraiserCA/tlsca/*-cert.pem image/appraiserCA/tlsca/cert.pem

cp -r artifacts/crypto-config/peerOrganizations/appraiser-org/peers/appraiser-peer/msp image/appraiserPeer
cp -r artifacts/crypto-config/peerOrganizations/appraiser-org/peers/appraiser-peer/tls image/appraiserPeer

cp -r artifacts/crypto-config/peerOrganizations/audit-org/ca image/auditCA
cp -r artifacts/crypto-config/peerOrganizations/audit-org/tlsca image/auditCA

mv image/auditCA/ca/priv_sk image/auditCA/ca/key.pem
mv image/auditCA/tlsca/priv_sk image/auditCA/tlsca/key.pem
mv image/auditCA/ca/*-cert.pem image/auditCA/ca/cert.pem
mv image/auditCA/tlsca/*-cert.pem image/auditCA/tlsca/cert.pem

cp -r artifacts/crypto-config/peerOrganizations/audit-org/peers/audit-peer/msp image/auditPeer
cp -r artifacts/crypto-config/peerOrganizations/audit-org/peers/audit-peer/tls image/auditPeer

cp -r artifacts/crypto-config/peerOrganizations/bank-org/ca image/bankCA
cp -r artifacts/crypto-config/peerOrganizations/bank-org/tlsca image/bankCA

mv image/bankCA/ca/priv_sk image/bankCA/ca/key.pem
mv image/bankCA/tlsca/priv_sk image/bankCA/tlsca/key.pem
mv image/bankCA/ca/*-cert.pem image/bankCA/ca/cert.pem
mv image/bankCA/tlsca/*-cert.pem image/bankCA/tlsca/cert.pem

cp -r artifacts/crypto-config/peerOrganizations/bank-org/peers/bank-peer/msp image/bankPeer
cp -r artifacts/crypto-config/peerOrganizations/bank-org/peers/bank-peer/tls image/bankPeer

cp -r artifacts/crypto-config/peerOrganizations/fico-org/ca image/ficoCA
cp -r artifacts/crypto-config/peerOrganizations/fico-org/tlsca image/ficoCA

mv image/ficoCA/ca/priv_sk image/ficoCA/ca/key.pem
mv image/ficoCA/tlsca/priv_sk image/ficoCA/tlsca/key.pem
mv image/ficoCA/ca/*-cert.pem image/ficoCA/ca/cert.pem
mv image/ficoCA/tlsca/*-cert.pem image/ficoCA/tlsca/cert.pem

cp -r artifacts/crypto-config/peerOrganizations/fico-org/peers/fico-peer/msp image/ficoPeer
cp -r artifacts/crypto-config/peerOrganizations/fico-org/peers/fico-peer/tls image/ficoPeer

cp -r artifacts/crypto-config/peerOrganizations/insurance-org/ca image/insuranceCA
cp -r artifacts/crypto-config/peerOrganizations/insurance-org/tlsca image/insuranceCA

mv image/insuranceCA/ca/priv_sk image/insuranceCA/ca/key.pem
mv image/insuranceCA/tlsca/priv_sk image/insuranceCA/tlsca/key.pem
mv image/insuranceCA/ca/*-cert.pem image/insuranceCA/ca/cert.pem
mv image/insuranceCA/tlsca/*-cert.pem image/insuranceCA/tlsca/cert.pem

cp -r artifacts/crypto-config/peerOrganizations/insurance-org/peers/insurance-peer/msp image/insurancePeer
cp -r artifacts/crypto-config/peerOrganizations/insurance-org/peers/insurance-peer/tls image/insurancePeer

cp -r artifacts/crypto-config/peerOrganizations/registry-org/ca image/registryCA
cp -r artifacts/crypto-config/peerOrganizations/registry-org/tlsca image/registryCA

mv image/registryCA/ca/priv_sk image/registryCA/ca/key.pem
mv image/registryCA/tlsca/priv_sk image/registryCA/tlsca/key.pem
mv image/registryCA/ca/*-cert.pem image/registryCA/ca/cert.pem
mv image/registryCA/tlsca/*-cert.pem image/registryCA/tlsca/cert.pem

cp -r artifacts/crypto-config/peerOrganizations/registry-org/peers/registry-peer/msp image/registryPeer
cp -r artifacts/crypto-config/peerOrganizations/registry-org/peers/registry-peer/tls image/registryPeer

cp -r artifacts/crypto-config/peerOrganizations/title-org/ca image/titleCA
cp -r artifacts/crypto-config/peerOrganizations/title-org/tlsca image/titleCA

mv image/titleCA/ca/priv_sk image/titleCA/ca/key.pem
mv image/titleCA/tlsca/priv_sk image/titleCA/tlsca/key.pem
mv image/titleCA/ca/*-cert.pem image/titleCA/ca/cert.pem
mv image/titleCA/tlsca/*-cert.pem image/titleCA/tlsca/cert.pem

cp -r artifacts/crypto-config/peerOrganizations/title-org/peers/title-peer/msp image/titlePeer
cp -r artifacts/crypto-config/peerOrganizations/title-org/peers/title-peer/tls image/titlePeer
