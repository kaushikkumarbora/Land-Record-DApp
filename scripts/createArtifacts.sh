#!/bin/bash

export FABRIC_START_WAIT=3
export FABRIC_CFG_PATH=./

echo -e "\e[5;32;40mgenerating certificates in crypto-config folder for all entities\e[m "
rm -rf artifacts
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


./binaries/configtxgen -profile RecordsChannel -outputAnchorPeersUpdate ./artifacts/channels/recordsanchor.tx -channelID records -asOrg RegistryOrgMSP
sleep ${FABRIC_START_WAIT}
./binaries/configtxgen -profile LendingChannel -outputAnchorPeersUpdate ./artifacts/channels/lendinganchor.tx -channelID lending -asOrg BankOrgMSP
sleep ${FABRIC_START_WAIT}
./binaries/configtxgen -profile BooksChannel -outputAnchorPeersUpdate ./artifacts/channels/booksanchor.tx -channelID books -asOrg AppraiserOrgMSP
