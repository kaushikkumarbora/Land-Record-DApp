#!/bin/bash

export FABRIC_START_WAIT=4

echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
echo -e "----\e[5;32;40mNow 1st phase of the Loan Request to get fico, appraisal, title search and insurance quotes \e[m"
echo "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"


echo -e "................\e[5;32;40mInitiate Mortgage request on  lending ledger for the customer\e[m ........................"
docker exec bank-cli bash -c "peer chaincode invoke -C lending -n lendingchaincode -c '{\"Args\":[\"initiateMortgage\", \"TestCustomer12131415\", \"12131415\",\"450000\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query lending ledger for the request created\e[m ........................"
docker exec audit-cli bash -c "peer chaincode query -C lending -n lendingchaincode -c '{\"Args\":[\"queryID\",\"TestCustomer12131415\", \"12131415\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mrequest ficoScore for  TestCustomer12131415 \e[m ..................................."
docker exec fico-cli bash -c "peer chaincode invoke -C lending -n lendingchaincode -c '{\"Args\":[\"getFicoScores\", \"TestCustomer12131415\", \"12131415\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query lending ledger for the ficoScore created\e[m ..............................."
docker exec audit-cli bash -c "peer chaincode query -C lending -n lendingchaincode -c '{\"Args\":[\"queryID\",\"TestCustomer12131415\", \"12131415\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mrequest Appraisal \e[m........................"
docker exec appraiser-cli bash -c "peer chaincode invoke -C books -n bookschaincode -c '{\"Args\":[\"getAppraisal\", \"12131415\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query books ledger for the appraiser created f\e[m..............................."
docker exec audit-cli bash -c "peer chaincode query -C books -n bookschaincode -c '{\"Args\":[\"queryID\",\"12131415\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mrequest Insurance quote \e[m ..................................."
docker exec insurance-cli bash -c "peer chaincode invoke -C lending -n lendingchaincode -c '{\"Args\":[\"getInsuranceQuote\", \"TestCustomer12131415\", \"12131415\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query lending ledger for the insurance quote created\e[m ..............................."
docker exec audit-cli bash -c "peer chaincode query -C lending -n lendingchaincode -c '{\"Args\":[\"queryID\",\"TestCustomer12131415\", \"12131415\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"

echo -e "................\e[5;32;40mget Title on books ledger \e[m  .................................."
docker exec title-cli bash -c "peer chaincode invoke -C books -n bookschaincode -c '{\"Args\":[\"getTitle\", \"12131415\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query books ledger for the Title created \e[m..............................."
docker exec audit-cli bash -c "peer chaincode query -C books -n bookschaincode -c '{\"Args\":[\"queryID\",\"12131415\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"
echo -e "----\e[5;32;40mNow 2nd phase of the Loan Request to close the loan change titles and update registry \e[m"
echo "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++"

echo -e "................\e[5;32;40mclose the mortgage based on bank criteria \e[m..................................."
docker exec bank-cli bash -c "peer chaincode invoke -C lending -n lendingchaincode -c '{\"Args\":[\"closeMortgage\", \"TestCustomer12131415\", \"12131415\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}


echo -e "................\e[5;32;40mAudit query lending ledger for closed mortgage status \e[m..............................."
docker exec audit-cli bash -c "peer chaincode query -C lending -n lendingchaincode -c '{\"Args\":[\"queryID\",\"TestCustomer12131415\", \"12131415\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mChange Title on books ledger on \e[m  .................................."
docker exec title-cli bash -c "peer chaincode invoke -C books -n bookschaincode -c '{\"Args\":[\"changeTitle\", \"12131415\", \"TestCustomer12131415\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query books ledger for the Titlechanges \e[m..............................."
docker exec audit-cli bash -c "peer chaincode query -C books -n bookschaincode -c '{\"Args\":[\"queryID\",\"12131415\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mrecord purchase on records ledger for new owner  \e[m ..................................."
docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"recordPurchase\", \"12131415\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "................\e[5;32;40mAudit query records ledger for the owner changes if loan was successful \e[m..............................."
docker exec audit-cli bash -c "peer chaincode query -C records -n recordschaincode -c '{\"Args\":[\"queryID\",\"12131415\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}
