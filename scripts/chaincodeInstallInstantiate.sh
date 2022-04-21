
#!/bin/bash

export FABRIC_START_WAIT=5

rm -rf chaincode/package
mkdir chaincode/package

echo -e '-----------------------\e[5;32;40m Packaging chaincodes\e[m---------------------------------------------------------'

echo " ----------------------------- For Records channel --------------------------------------------"
docker exec registry-cli bash -c 'peer lifecycle chaincode package /chaincode/package/recordschaincode.tar.gz --path /chaincode/landrecord -l node --label recordschaincode_0.0'

echo "----------------------------- For books channel------------------------------------------------"
docker exec registry-cli bash -c 'peer lifecycle chaincode package /chaincode/package/bookschaincode.tar.gz --path /chaincode/books -l node --label bookschaincode_0.0'

echo " ----------------- For lending channel ----------------------------------------------------"
docker exec registry-cli bash -c 'peer lifecycle chaincode package /chaincode/package/lendingchaincode.tar.gz --path /chaincode/lending -l node --label lendingchaincode_0.0'

echo -e '-----------------------\e[5;32;40m Install chaincodes\e[m---------------------------------------------------------'

echo " ----------------------------- For Records channel --------------------------------------------"
docker exec registry-cli bash -c 'peer lifecycle chaincode install /chaincode/package/recordschaincode.tar.gz'
docker exec audit-cli bash -c 'peer lifecycle chaincode install /chaincode/package/recordschaincode.tar.gz'
docker exec bank-cli bash -c 'peer lifecycle chaincode install /chaincode/package/recordschaincode.tar.gz'
docker exec appraiser-cli bash -c 'peer lifecycle chaincode install /chaincode/package/recordschaincode.tar.gz'
docker exec title-cli bash -c 'peer lifecycle chaincode install /chaincode/package/recordschaincode.tar.gz'
docker exec insurance-cli bash -c 'peer lifecycle chaincode install /chaincode/package/recordschaincode.tar.gz'
docker exec fico-cli bash -c 'peer lifecycle chaincode install /chaincode/package/recordschaincode.tar.gz'

sleep ${FABRIC_START_WAIT}

echo "----------------------------- For books channel------------------------------------------------"
docker exec appraiser-cli bash -c 'peer lifecycle chaincode install /chaincode/package/bookschaincode.tar.gz'
docker exec title-cli bash -c 'peer lifecycle chaincode install /chaincode/package/bookschaincode.tar.gz'
docker exec bank-cli bash -c 'peer lifecycle chaincode install /chaincode/package/bookschaincode.tar.gz'
docker exec insurance-cli bash -c 'peer lifecycle chaincode install /chaincode/package/bookschaincode.tar.gz'
docker exec audit-cli bash -c 'peer lifecycle chaincode install /chaincode/package/bookschaincode.tar.gz'
docker exec registry-cli bash -c 'peer lifecycle chaincode install /chaincode/package/bookschaincode.tar.gz'
sleep ${FABRIC_START_WAIT}

echo " ----------------- For lending channel ----------------------------------------------------"
docker exec bank-cli bash -c 'peer lifecycle chaincode install /chaincode/package/lendingchaincode.tar.gz'
docker exec fico-cli bash -c 'peer lifecycle chaincode install /chaincode/package/lendingchaincode.tar.gz'
docker exec insurance-cli bash -c 'peer lifecycle chaincode install /chaincode/package/lendingchaincode.tar.gz'
docker exec audit-cli bash -c 'peer lifecycle chaincode install /chaincode/package/lendingchaincode.tar.gz'
docker exec title-cli bash -c 'peer lifecycle chaincode install /chaincode/package/lendingchaincode.tar.gz'
sleep ${FABRIC_START_WAIT}

echo -e '-----------------------\e[5;32;40m Getting Package IDs\e[m---------------------------------------------------------'

docker exec audit-cli bash -c 'peer lifecycle chaincode queryinstalled' > log.txt
cat log.txt
export PACKAGE_ID_R=$(sed -n "/recordschaincode_0.0/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
export PACKAGE_ID_L=$(sed -n "/lendingchaincode_0.0/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
export PACKAGE_ID_B=$(sed -n "/bookschaincode_0.0/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)

echo -e '-----------------------\e[5;32;40m Approve chaincodes\e[m---------------------------------------------------------'

echo " ----------------------------- For Records channel --------------------------------------------"
docker exec registry-cli bash -c "peer lifecycle chaincode approveformyorg -C records --signature-policy \"AND('RegistryMSP.member')\" -n recordschaincode -v 0.0 --package-id ${PACKAGE_ID_R} --sequence 1 --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec audit-cli bash -c "peer lifecycle chaincode approveformyorg -C records --signature-policy \"AND('RegistryMSP.member')\" -n recordschaincode -v 0.0 --package-id ${PACKAGE_ID_R} --sequence 1 --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec bank-cli bash -c "peer lifecycle chaincode approveformyorg -C records --signature-policy \"AND('RegistryMSP.member')\" -n recordschaincode -v 0.0 --package-id ${PACKAGE_ID_R} --sequence 1 --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec appraiser-cli bash -c "peer lifecycle chaincode approveformyorg -C records --signature-policy \"AND('RegistryMSP.member')\" -n recordschaincode -v 0.0 --package-id ${PACKAGE_ID_R} --sequence 1 --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec title-cli bash -c "peer lifecycle chaincode approveformyorg -C records --signature-policy \"AND('RegistryMSP.member')\" -n recordschaincode -v 0.0 --package-id ${PACKAGE_ID_R} --sequence 1 --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec insurance-cli bash -c "peer lifecycle chaincode approveformyorg -C records --signature-policy \"AND('RegistryMSP.member')\" -n recordschaincode -v 0.0 --package-id ${PACKAGE_ID_R} --sequence 1 --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec fico-cli bash -c "peer lifecycle chaincode approveformyorg -C records --signature-policy \"AND('RegistryMSP.member')\" -n recordschaincode -v 0.0 --package-id ${PACKAGE_ID_R} --sequence 1 --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo "----------------------------- For books channel------------------------------------------------"
docker exec appraiser-cli bash -c "peer lifecycle chaincode approveformyorg -C books --signature-policy \"OR('AppraiserMSP.member', 'TitleMSP.member')\" -n bookschaincode -v 0.0 --package-id ${PACKAGE_ID_B} --sequence 1 --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec title-cli bash -c "peer lifecycle chaincode approveformyorg -C books --signature-policy \"OR('AppraiserMSP.member', 'TitleMSP.member')\" -n bookschaincode -v 0.0 --package-id ${PACKAGE_ID_B} --sequence 1 --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec bank-cli bash -c "peer lifecycle chaincode approveformyorg -C books --signature-policy \"OR('AppraiserMSP.member', 'TitleMSP.member')\" -n bookschaincode -v 0.0 --package-id ${PACKAGE_ID_B} --sequence 1 --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec insurance-cli bash -c "peer lifecycle chaincode approveformyorg -C books --signature-policy \"OR('AppraiserMSP.member', 'TitleMSP.member')\" -n bookschaincode -v 0.0 --package-id ${PACKAGE_ID_B} --sequence 1 --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec audit-cli bash -c "peer lifecycle chaincode approveformyorg -C books --signature-policy \"OR('AppraiserMSP.member', 'TitleMSP.member')\" -n bookschaincode -v 0.0 --package-id ${PACKAGE_ID_B} --sequence 1 --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec registry-cli bash -c "peer lifecycle chaincode approveformyorg -C books --signature-policy \"OR('AppraiserMSP.member', 'TitleMSP.member')\" -n bookschaincode -v 0.0 --package-id ${PACKAGE_ID_B} --sequence 1 --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo " ----------------- For lending channel ----------------------------------------------------"
docker exec bank-cli bash -c "peer lifecycle chaincode approveformyorg -C lending --signature-policy \"OR('BankMSP.member', 'FicoMSP.member', 'InsuranceMSP.member')\" -n lendingchaincode -v 0.0 --package-id ${PACKAGE_ID_L} --sequence 1 --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec fico-cli bash -c "peer lifecycle chaincode approveformyorg -C lending --signature-policy \"OR('BankMSP.member', 'FicoMSP.member', 'InsuranceMSP.member')\" -n lendingchaincode -v 0.0 --package-id ${PACKAGE_ID_L} --sequence 1 --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec insurance-cli bash -c "peer lifecycle chaincode approveformyorg -C lending --signature-policy \"OR('BankMSP.member', 'FicoMSP.member', 'InsuranceMSP.member')\" -n lendingchaincode -v 0.0 --package-id ${PACKAGE_ID_L} --sequence 1 --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec audit-cli bash -c "peer lifecycle chaincode approveformyorg -C lending --signature-policy \"OR('BankMSP.member', 'FicoMSP.member', 'InsuranceMSP.member')\" -n lendingchaincode -v 0.0 --package-id ${PACKAGE_ID_L} --sequence 1 --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec title-cli bash -c "peer lifecycle chaincode approveformyorg -C lending --signature-policy \"OR('BankMSP.member', 'FicoMSP.member', 'InsuranceMSP.member')\" -n lendingchaincode -v 0.0 --package-id ${PACKAGE_ID_L} --sequence 1 --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e '-----------------------\e[5;32;40m Commit chaincodes\e[m---------------------------------------------------------'

echo " ----------------------------- For Records channel --------------------------------------------"
docker exec registry-cli  bash -c 'peer lifecycle chaincode checkcommitreadiness -C records -n recordschaincode -v 0.0 --sequence 1 --tls --cafile $ORDERER_TLS_ROOTCERT_FILE'
docker exec registry-cli  bash -c "peer lifecycle chaincode commit -C records --signature-policy \"AND('RegistryMSP.member')\" -n recordschaincode -v 0.0 --sequence 1 --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE --peerAddresses registry-peer:7051 --tlsRootCertFiles crypto-config/peerOrganizations/registry-org/peers/registry-peer/tls/ca.crt --peerAddresses appraiser-peer:7051 --tlsRootCertFiles crypto-config/peerOrganizations/appraiser-org/peers/appraiser-peer/tls/ca.crt --peerAddresses audit-peer:7051 --tlsRootCertFiles crypto-config/peerOrganizations/audit-org/peers/audit-peer/tls/ca.crt --peerAddresses bank-peer:7051 --tlsRootCertFiles crypto-config/peerOrganizations/bank-org/peers/bank-peer/tls/ca.crt --peerAddresses fico-peer:7051 --tlsRootCertFiles crypto-config/peerOrganizations/fico-org/peers/fico-peer/tls/ca.crt --peerAddresses insurance-peer:7051 --tlsRootCertFiles crypto-config/peerOrganizations/insurance-org/peers/insurance-peer/tls/ca.crt --peerAddresses title-peer:7051 --tlsRootCertFiles crypto-config/peerOrganizations/title-org/peers/title-peer/tls/ca.crt"
sleep ${FABRIC_START_WAIT}
echo "----------------------------- For books channel------------------------------------------------"
docker exec appraiser-cli  bash -c 'peer lifecycle chaincode checkcommitreadiness -C books -n bookschaincode -v 0.0 --sequence 1 --tls --cafile $ORDERER_TLS_ROOTCERT_FILE'
docker exec appraiser-cli  bash -c "peer lifecycle chaincode commit -C books --signature-policy \"OR('AppraiserMSP.member', 'TitleMSP.member')\" -n bookschaincode -v 0.0 --sequence 1 --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE --peerAddresses appraiser-peer:7051 --tlsRootCertFiles crypto-config/peerOrganizations/appraiser-org/peers/appraiser-peer/tls/ca.crt --peerAddresses registry-peer:7051 --tlsRootCertFiles crypto-config/peerOrganizations/registry-org/peers/registry-peer/tls/ca.crt --peerAddresses audit-peer:7051 --tlsRootCertFiles crypto-config/peerOrganizations/audit-org/peers/audit-peer/tls/ca.crt --peerAddresses bank-peer:7051 --tlsRootCertFiles crypto-config/peerOrganizations/bank-org/peers/bank-peer/tls/ca.crt --peerAddresses insurance-peer:7051 --tlsRootCertFiles crypto-config/peerOrganizations/insurance-org/peers/insurance-peer/tls/ca.crt --peerAddresses title-peer:7051 --tlsRootCertFiles crypto-config/peerOrganizations/title-org/peers/title-peer/tls/ca.crt"
sleep ${FABRIC_START_WAIT}
echo " ----------------- For lending channel ----------------------------------------------------"
docker exec bank-cli  bash -c 'peer lifecycle chaincode checkcommitreadiness -C lending -n lendingchaincode -v 0.0 --sequence 1 --tls --cafile $ORDERER_TLS_ROOTCERT_FILE'
docker exec bank-cli  bash -c "peer lifecycle chaincode commit -C lending --signature-policy \"OR('BankMSP.member', 'FicoMSP.member', 'InsuranceMSP.member')\" -n lendingchaincode -v 0.0 --sequence 1 --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE --peerAddresses bank-peer:7051 --tlsRootCertFiles crypto-config/peerOrganizations/bank-org/peers/bank-peer/tls/ca.crt --peerAddresses audit-peer:7051 --tlsRootCertFiles crypto-config/peerOrganizations/audit-org/peers/audit-peer/tls/ca.crt --peerAddresses fico-peer:7051 --tlsRootCertFiles crypto-config/peerOrganizations/fico-org/peers/fico-peer/tls/ca.crt --peerAddresses insurance-peer:7051 --tlsRootCertFiles crypto-config/peerOrganizations/insurance-org/peers/insurance-peer/tls/ca.crt --peerAddresses title-peer:7051 --tlsRootCertFiles crypto-config/peerOrganizations/title-org/peers/title-peer/tls/ca.crt"
sleep ${FABRIC_START_WAIT}

# echo -e "-----------------------'\e[5;32;40m Instantiate chaincodes\e[m---------------------------------------------------------"

# echo "---------------Instantiate chaincode on lending channel with permission for Bank, Insurance and Fico to invoke the chaincode and Audit+Title to have readonly access-------------------"

# docker exec bank-cli bash -c "peer lifecycle chaincode instantiate -C lending -n lendingchaincode -v 0 -c '{\"Args\":[]}'  -P \"OR ('BankMSP.member', 'InsuranceMSP.member','FicoMSP.member')\""
# echo "---------------Instantiate chaincode on books channel with permission for Appraiser&  Title  to invoke the chaincode and Bank+Insurance+Audit+Registry to have readonly access----------------------------"
# docker exec appraiser-cli bash -c "peer lifecycle chaincode instantiate -C books -n bookschaincode -v 0 -c '{\"Args\":[]}' -P \"OR ('AppraiserMSP.member', 'TitleMSP.member')\""
# echo "---------------Instantiate chaincode on records channel with permission for Registry only  to invoke the chaincode and all others to have readonly access----------------------------"
# docker exec registry-cli bash -c "peer lifecycle chaincode instantiate -C records -n recordschaincode -v 0 -c '{\"Args\":[]}'"

# echo -e "----------------------'\e[5;32;40m END\e[m\'---------------------------------------------------------"
