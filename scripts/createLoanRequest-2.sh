#!/bin/bash

export FABRIC_START_WAIT=4

echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
echo -e "----\e[5;32;40mNow 1st phase of the Loan Request to get fico, appraisal, title search and insurance quotes \e[m"
echo "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"


echo -e "................\e[5;32;40mInitiate Loan request on  lending ledger for the customer\e[m ........................"
docker exec bank-cli bash -c "peer chaincode invoke -C lending -n lendingchaincode -c '{\"Args\":[\"initiateLoan\", \"TestCustomer891011\", \"891011\",\"450000\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query lending ledger for the request created\e[m ........................"
docker exec audit-cli bash -c "peer chaincode query -C lending -n lendingchaincode -c '{\"Args\":[\"queryID\",\"TestCustomer891011\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mrequest ficoScore for  TestCustomer891011 \e[m ..................................."
docker exec fico-cli bash -c "peer chaincode invoke -C lending -n lendingchaincode -c '{\"Args\":[\"getFicoScores\", \"TestCustomer891011\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query lending ledger for the ficoScore created\e[m ..............................."
docker exec audit-cli bash -c "peer chaincode query -C lending -n lendingchaincode -c '{\"Args\":[\"queryID\",\"TestCustomer891011\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mrequest Insurance quote \e[m ..................................."
docker exec insurance-cli bash -c "peer chaincode invoke -C lending -n lendingchaincode -c '{\"Args\":[\"getInsuranceQuote\", \"TestCustomer891011\", \"891011\", \"INS1\", \"123123123\", \"123123123\", \"3.5\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query lending ledger for the insurance quote created\e[m ..............................."
docker exec audit-cli bash -c "peer chaincode query -C lending -n lendingchaincode -c '{\"Args\":[\"queryID\",\"TestCustomer891011\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"

echo -e "................\e[5;32;40mrequest Appraisal \e[m........................"
docker exec appraiser-cli bash -c "peer chaincode invoke -C lending -n lendingchaincode -c '{\"Args\":[\"getAppraisal\", \"TestCustomer891011\", \"891011\", \"123123123\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query lending ledger for the appraiser created f\e[m..............................."
docker exec audit-cli bash -c "peer chaincode query -C lending -n lendingchaincode -c '{\"Args\":[\"queryID\", \"TestCustomer891011\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mprocess Loan on lending ledger \e[m  .................................."
docker exec bank-cli bash -c "peer chaincode invoke -C lending -n lendingchaincode -c '{\"Args\":[\"processLoan\", \"TestCustomer891011\", \"891011\", \"true\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query lending ledger for the Title created \e[m..............................."
docker exec audit-cli bash -c "peer chaincode query -C lending -n lendingchaincode -c '{\"Args\":[\"queryID\", \"TestCustomer891011\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
echo -e "----\e[5;32;40mNow 2nd phase of the Loan Request to initiate the mortgage request \e[m"
echo "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"

echo -e "................\e[5;32;40minitiate the registraion request \e[m..................................."
docker exec revenue-cli bash -c "peer chaincode invoke -C registration -n registrationchaincode -c '{\"Args\":[\"initiateRegistration\", \"891011\", \"1000000\", \"\", \"TestCustomer891011\", \"Hillary \"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query registration ledger for registration status \e[m..............................."
docker exec audit-cli bash -c "peer chaincode query -C registration -n registrationchaincode -c '{\"Args\":[\"queryID\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40minitiate the mortgage request based on bank criteria \e[m..................................."
docker exec bank-cli bash -c "peer chaincode invoke -C lending -n lendingchaincode -c '{\"Args\":[\"initiateMortgage\", \"TestCustomer891011\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query lending ledger for mortgage status \e[m..............................."
docker exec audit-cli bash -c "peer chaincode query -C lending -n lendingchaincode -c '{\"Args\":[\"queryID\",\"TestCustomer891011\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
echo -e "----\e[5;32;40mNow 3rd phase of create Registration Request to initiate the transfer \e[m"
echo "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"

echo -e "................\e[5;32;40mset permission request based on criteria \e[m..................................."
docker exec municipal-cli bash -c "peer chaincode invoke -C registration -n registrationchaincode -c '{\"Args\":[\"setPermission\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query registration ledger for registration status \e[m..............................."
docker exec audit-cli bash -c "peer chaincode query -C registration -n registrationchaincode -c '{\"Args\":[\"queryID\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mset DnC charges based on bank criteria \e[m..................................."
docker exec revenue-cli bash -c "peer chaincode invoke -C registration -n registrationchaincode -c '{\"Args\":[\"setDnC\", \"891011\", \"100\", \"100\", \"15000\", \"1543.45\", \"123.4\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query registration ledger for registration status \e[m..............................."
docker exec audit-cli bash -c "peer chaincode query -C registration -n registrationchaincode -c '{\"Args\":[\"queryID\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40msign the Deed \e[m..................................."
docker exec revenue-cli bash -c "peer chaincode invoke -C registration -n registrationchaincode -c '{\"Args\":[\"signDeed\", \"891011\", \"Signature\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query registration ledger for registration status \e[m..............................."
docker exec audit-cli bash -c "peer chaincode query -C registration -n registrationchaincode -c '{\"Args\":[\"queryID\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40msign the Deed \e[m..................................."
docker exec revenue-cli bash -c "peer chaincode invoke -C registration -n registrationchaincode -c '{\"Args\":[\"signDeed\", \"891011\", \"Signature\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query registration ledger for registration status \e[m..............................."
docker exec audit-cli bash -c "peer chaincode query -C registration -n registrationchaincode -c '{\"Args\":[\"queryID\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40msign the Deed \e[m..................................."
docker exec revenue-cli bash -c "peer chaincode invoke -C registration -n registrationchaincode -c '{\"Args\":[\"signDeedW\", \"891011\", \"Signature\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query registration ledger for registration status \e[m..............................."
docker exec audit-cli bash -c "peer chaincode query -C registration -n registrationchaincode -c '{\"Args\":[\"queryID\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40msubmit the Deed for approval \e[m..................................."
docker exec revenue-cli bash -c "peer chaincode invoke -C registration -n registrationchaincode -c '{\"Args\":[\"submitDeed\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query registration ledger for registration status \e[m..............................."
docker exec audit-cli bash -c "peer chaincode query -C registration -n registrationchaincode -c '{\"Args\":[\"queryID\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mapprove the Deed \e[m..................................."
docker exec revenue-cli bash -c "peer chaincode invoke -C registration -n registrationchaincode -c '{\"Args\":[\"approveDeed\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query registration ledger for registration status \e[m..............................."
docker exec audit-cli bash -c "peer chaincode query -C registration -n registrationchaincode -c '{\"Args\":[\"queryID\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
echo -e "----\e[5;32;40mNow 4th phase Transfer \e[m"
echo "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"

echo -e "................\e[5;32;40mstart the Mortgage \e[m..................................."
docker exec revenue-cli bash -c "peer chaincode invoke -C lending -n lendingchaincode -c '{\"Args\":[\"startMortgage\", \"TestCustomer891011\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query lending ledger for Mortgage status \e[m..............................."
docker exec audit-cli bash -c "peer chaincode query -C lending -n lendingchaincode -c '{\"Args\":[\"queryID\", \"TestCustomer891011\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mrecord Purchase \e[m..................................."
docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"recordPurchase\", \"891011\", \"TestCustomer891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query records ledger for Transfer status \e[m..............................."
docker exec audit-cli bash -c "peer chaincode query -C records -n recordschaincode -c '{\"Args\":[\"queryID\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mcomplete Deed \e[m..................................."
docker exec revenue-cli bash -c "peer chaincode invoke -C registration -n registrationchaincode -c '{\"Args\":[\"completeDeed\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query registration ledger for Deed status \e[m..............................."
docker exec audit-cli bash -c "peer chaincode query -C registration -n registrationchaincode -c '{\"Args\":[\"queryID\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mclose the Mortgage \e[m..................................."
docker exec bank-cli bash -c "peer chaincode invoke -C lending -n lendingchaincode -c '{\"Args\":[\"closeMortgage\", \"TestCustomer891011\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query lending ledger for Mortgage status \e[m..............................."
docker exec audit-cli bash -c "peer chaincode query -C lending -n lendingchaincode -c '{\"Args\":[\"queryID\", \"TestCustomer891011\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query records ledger for records \e[m..............................."
docker exec audit-cli bash -c "peer chaincode query -C records -n recordschaincode -c '{\"Args\":[\"queryID\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}
