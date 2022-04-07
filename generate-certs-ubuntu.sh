#!/bin/sh
set -e

echo
echo "#################################################################"
echo "#######        Generating cryptographic material       ##########"
echo "#################################################################"
PROJPATH=$(pwd)
CLIPATH=$PROJPATH/cli/peers
ORDERERS=$CLIPATH/ordererOrganizations
PEERS=$CLIPATH/peerOrganizations

rm -rf $CLIPATH
$PROJPATH/cryptogen generate --config=$PROJPATH/crypto-config.yaml --output=$CLIPATH

sh generate-cfgtx.sh

# rm -rf $PROJPATH/{orderer,landrecordPeer,courtPeer,incometaxPeer,bankPeer}/crypto
rm -rf $PROJPATH/orderer/crypto
rm -rf $PROJPATH/landrecordPeer/crypto
rm -rf $PROJPATH/courtPeer/crypto
rm -rf $PROJPATH/incometaxPeer/crypto
rm -rf $PROJPATH/bankPeer/crypto
# mkdir $PROJPATH/{orderer,landrecordPeer,courtPeer,incometaxPeer,bankPeer}/crypto
mkdir $PROJPATH/orderer/crypto
mkdir $PROJPATH/landrecordPeer/crypto
mkdir $PROJPATH/courtPeer/crypto
mkdir $PROJPATH/incometaxPeer/crypto
mkdir $PROJPATH/bankPeer/crypto
# cp -r $ORDERERS/orderer-org/orderers/orderer0/{msp,tls} $PROJPATH/orderer/crypto
cp -r $ORDERERS/orderer-org/orderers/orderer0/msp $PROJPATH/orderer/crypto
cp -r $ORDERERS/orderer-org/orderers/orderer0/tls $PROJPATH/orderer/crypto
# cp -r $PEERS/landrecord-org/peers/landrecord-peer/{msp,tls} $PROJPATH/landrecordPeer/crypto
cp -r $PEERS/landrecord-org/peers/landrecord-peer/msp $PROJPATH/landrecordPeer/crypto
cp -r $PEERS/landrecord-org/peers/landrecord-peer/tls $PROJPATH/landrecordPeer/crypto
# cp -r $PEERS/court-org/peers/court-peer/{msp,tls} $PROJPATH/courtPeer/crypto
cp -r $PEERS/court-org/peers/court-peer/msp $PROJPATH/courtPeer/crypto
cp -r $PEERS/court-org/peers/court-peer/tls $PROJPATH/courtPeer/crypto
# cp -r $PEERS/incometax-org/peers/incometax-peer/{msp,tls} $PROJPATH/incometaxPeer/crypto
cp -r $PEERS/incometax-org/peers/incometax-peer/msp $PROJPATH/incometaxPeer/crypto
cp -r $PEERS/incometax-org/peers/incometax-peer/tls $PROJPATH/incometaxPeer/crypto
# cp -r $PEERS/bank-org/peers/bank-peer/{msp,tls} $PROJPATH/bankPeer/crypto
cp -r $PEERS/bank-org/peers/bank-peer/msp $PROJPATH/bankPeer/crypto
cp -r $PEERS/bank-org/peers/bank-peer/tls $PROJPATH/bankPeer/crypto
cp $CLIPATH/genesis.block $PROJPATH/orderer/crypto/

LANDRECORDCAPATH=$PROJPATH/landrecordCA
COURTCAPATH=$PROJPATH/courtCA
INCOMETAXCAPATH=$PROJPATH/incometaxCA
BANKCAPATH=$PROJPATH/bankCA

# rm -rf {$LANDRECORDCAPATH,$COURTCAPATH,$INCOMETAXCAPATH,$BANKCAPATH}/{ca,tls}
rm -rf $LANDRECORDCAPATH/ca
rm -rf $COURTCAPATH/ca
rm -rf $INCOMETAXCAPATH/ca
rm -rf $BANKCAPATH/ca
rm -rf $LANDRECORDCAPATH/tls
rm -rf $COURTCAPATH/tls
rm -rf $INCOMETAXCAPATH/tls
rm -rf $BANKCAPATH/tls
# mkdir -p {$LANDRECORDCAPATH,$COURTCAPATH,$INCOMETAXCAPATH,$BANKCAPATH}/{ca,tls}
mkdir -p $LANDRECORDCAPATH/ca
mkdir -p $COURTCAPATH/ca
mkdir -p $INCOMETAXCAPATH/ca
mkdir -p $BANKCAPATH/ca
mkdir -p $LANDRECORDCAPATH/tls
mkdir -p $COURTCAPATH/tls
mkdir -p $INCOMETAXCAPATH/tls
mkdir -p $BANKCAPATH/tls
cp $PEERS/landrecord-org/ca/* $LANDRECORDCAPATH/ca
cp $PEERS/landrecord-org/tlsca/* $LANDRECORDCAPATH/tls
mv $LANDRECORDCAPATH/ca/*_sk $LANDRECORDCAPATH/ca/key.pem
mv $LANDRECORDCAPATH/ca/*-cert.pem $LANDRECORDCAPATH/ca/cert.pem
mv $LANDRECORDCAPATH/tls/*_sk $LANDRECORDCAPATH/tls/key.pem
mv $LANDRECORDCAPATH/tls/*-cert.pem $LANDRECORDCAPATH/tls/cert.pem

cp $PEERS/court-org/ca/* $COURTCAPATH/ca
cp $PEERS/court-org/tlsca/* $COURTCAPATH/tls
mv $COURTCAPATH/ca/*_sk $COURTCAPATH/ca/key.pem
mv $COURTCAPATH/ca/*-cert.pem $COURTCAPATH/ca/cert.pem
mv $COURTCAPATH/tls/*_sk $COURTCAPATH/tls/key.pem
mv $COURTCAPATH/tls/*-cert.pem $COURTCAPATH/tls/cert.pem

cp $PEERS/incometax-org/ca/* $INCOMETAXCAPATH/ca
cp $PEERS/incometax-org/tlsca/* $INCOMETAXCAPATH/tls
mv $INCOMETAXCAPATH/ca/*_sk $INCOMETAXCAPATH/ca/key.pem
mv $INCOMETAXCAPATH/ca/*-cert.pem $INCOMETAXCAPATH/ca/cert.pem
mv $INCOMETAXCAPATH/tls/*_sk $INCOMETAXCAPATH/tls/key.pem
mv $INCOMETAXCAPATH/tls/*-cert.pem $INCOMETAXCAPATH/tls/cert.pem

cp $PEERS/bank-org/ca/* $BANKCAPATH/ca
cp $PEERS/bank-org/tlsca/* $BANKCAPATH/tls
mv $BANKCAPATH/ca/*_sk $BANKCAPATH/ca/key.pem
mv $BANKCAPATH/ca/*-cert.pem $BANKCAPATH/ca/cert.pem
mv $BANKCAPATH/tls/*_sk $BANKCAPATH/tls/key.pem
mv $BANKCAPATH/tls/*-cert.pem $BANKCAPATH/tls/cert.pem

WEBCERTS=$PROJPATH/web/certs
rm -rf $WEBCERTS
mkdir -p $WEBCERTS
cp $PROJPATH/orderer/crypto/tls/ca.crt $WEBCERTS/ordererOrg.pem
cp $PROJPATH/landrecordPeer/crypto/tls/ca.crt $WEBCERTS/landrecordOrg.pem
cp $PROJPATH/courtPeer/crypto/tls/ca.crt $WEBCERTS/courtOrg.pem
cp $PROJPATH/incometaxPeer/crypto/tls/ca.crt $WEBCERTS/incometaxOrg.pem
cp $PROJPATH/bankPeer/crypto/tls/ca.crt $WEBCERTS/bankOrg.pem
cp $PEERS/landrecord-org/users/Admin@landrecord-org/msp/keystore/* $WEBCERTS/Admin@landrecord-org-key.pem
cp $PEERS/landrecord-org/users/Admin@landrecord-org/msp/signcerts/* $WEBCERTS/
cp $PEERS/bank-org/users/Admin@bank-org/msp/keystore/* $WEBCERTS/Admin@bank-org-key.pem
cp $PEERS/bank-org/users/Admin@bank-org/msp/signcerts/* $WEBCERTS/
cp $PEERS/court-org/users/Admin@court-org/msp/keystore/* $WEBCERTS/Admin@court-org-key.pem
cp $PEERS/court-org/users/Admin@court-org/msp/signcerts/* $WEBCERTS/
cp $PEERS/incometax-org/users/Admin@incometax-org/msp/keystore/* $WEBCERTS/Admin@incometax-org-key.pem
cp $PEERS/incometax-org/users/Admin@incometax-org/msp/signcerts/* $WEBCERTS/