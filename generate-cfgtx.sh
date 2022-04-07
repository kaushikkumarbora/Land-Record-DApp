#!/bin/sh

CHANNEL_NAME="default"
PROJPATH=$(pwd)
CLIPATH=$PROJPATH/cli/peers

echo
echo "##########################################################"
echo "#########  Generating Orderer Genesis block ##############"
echo "##########################################################"
$PROJPATH/configtxgen -profile FourOrgsGenesis -outputBlock $CLIPATH/genesis.block

echo
echo "#################################################################"
echo "### Generating channel configuration transaction 'channel.tx' ###"
echo "#################################################################"
$PROJPATH/configtxgen -profile FourOrgsChannel -outputCreateChannelTx $CLIPATH/channel.tx -channelID $CHANNEL_NAME
cp $CLIPATH/channel.tx $PROJPATH/web
echo
echo "#################################################################"
echo "####### Generating anchor peer update for LandRecordOrg ##########"
echo "#################################################################"
$PROJPATH/configtxgen -profile FourOrgsChannel -outputAnchorPeersUpdate $CLIPATH/LandRecordOrgMSPAnchors.tx -channelID $CHANNEL_NAME -asOrg LandRecordOrgMSP

echo
echo "#################################################################"
echo "#######    Generating anchor peer update for BankOrg   ##########"
echo "#################################################################"
$PROJPATH/configtxgen -profile FourOrgsChannel -outputAnchorPeersUpdate $CLIPATH/BankOrgMSPAnchors.tx -channelID $CHANNEL_NAME -asOrg BankOrgMSP

echo
echo "##################################################################"
echo "####### Generating anchor peer update for IncomeTaxOrg ##########"
echo "##################################################################"
$PROJPATH/configtxgen -profile FourOrgsChannel -outputAnchorPeersUpdate $CLIPATH/IncomeTaxOrgMSPAnchors.tx -channelID $CHANNEL_NAME -asOrg IncomeTaxOrgMSP

echo
echo "##################################################################"
echo "#######   Generating anchor peer update for CourtOrg   ##########"
echo "##################################################################"
$PROJPATH/configtxgen -profile FourOrgsChannel -outputAnchorPeersUpdate $CLIPATH/CourtOrgMSPAnchors.tx -channelID $CHANNEL_NAME -asOrg CourtOrgMSP
