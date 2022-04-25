#!/bin/bash

export FABRIC_START_WAIT=2
  export FABRIC_query_WAIT=5


echo -e "------------------------\e[5;32;40mNow creating real estates on the records blockchain\e[m ----------------------------------------------------"
sleep ${FABRIC_START_WAIT}

docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"createRealEstate\", \"123\", \"5 High Strret, TX 75000 \",\"250000\",\"4000 sq. ft 3 beds 2 baths blah blah\", \"John Doe\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"

docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"createRealEstate\", \"456\", \"6 Low Strret, FL 75001 \",\"500000\",\"6000 sq. ft 4 beds 2 baths blah blah\", \"Alice Monet\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"


docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"createRealEstate\", \"789\", \"7 High Strret, CA 75002 \",\"375000\",\"800 sq. ft 2 beds 2 baths blah blah\", \"Papa John\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"


docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"createRealEstate\", \"1234\", \"8 High Strret, MA 75003 \",\"400000\",\"3750 sq. ft 5 beds 2 baths blah blah\", \"Hooters\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"


docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"createRealEstate\", \"4567\", \"9 High Strret, LA 75004 \",\"1000000\",\"6500 sq. ft 6 beds 2 baths blah blah\", \"Bill Gates\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"


docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"createRealEstate\", \"11111\", \"10 High Strret, LA 75004 \",\"1100000\",\"6501 sq. ft 7 beds 2 baths blah blah\", \"Doug Gates\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"


docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"createRealEstate\", \"891011\", \"11 High Strret, LA 75004 \",\"100000\",\"6502 sq. ft 5 beds 2 baths blah blah\", \"Hillary \"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"


docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"createRealEstate\", \"12131415\", \"12 High Strret, LA 75004 \",\"3500000\",\"6503 sq. ft 7 beds 2 baths blah blah\", \"Billy Bob \"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"


docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"createRealEstate\", \"16171819\", \"5 High Strret, LA 75004 \",\"600000\",\"6504 sq. ft 5 beds 2 baths blah blah\", \"Vik Thor\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"


docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"createRealEstate\", \"22222\", \"5 High Strret, LA 75004 \",\"800000\",\"6500 sq. ft 6 beds 4 baths blah blah\", \"The man\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e "----------\e[5;32;40mNow creating Books on the books blockchain with real estate as the key\e[m --------------------------------"
docker exec appraiser-cli bash -c "peer chaincode invoke -C books -n bookschaincode -c '{\"Args\":[\"initiateBooks\", \"123\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec appraiser-cli bash -c "peer chaincode invoke -C books -n bookschaincode -c '{\"Args\":[\"initiateBooks\", \"456\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec appraiser-cli bash -c "peer chaincode invoke -C books -n bookschaincode -c '{\"Args\":[\"initiateBooks\", \"789\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec appraiser-cli bash -c "peer chaincode invoke -C books -n bookschaincode -c '{\"Args\":[\"initiateBooks\", \"1234\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec appraiser-cli bash -c "peer chaincode invoke -C books -n bookschaincode -c '{\"Args\":[\"initiateBooks\", \"4567\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec appraiser-cli bash -c "peer chaincode invoke -C books -n bookschaincode -c '{\"Args\":[\"initiateBooks\", \"11111\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec appraiser-cli bash -c "peer chaincode invoke -C books -n bookschaincode -c '{\"Args\":[\"initiateBooks\", \"891011\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec appraiser-cli bash -c "peer chaincode invoke -C books -n bookschaincode -c '{\"Args\":[\"initiateBooks\", \"12131415\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec appraiser-cli bash -c "peer chaincode invoke -C books -n bookschaincode -c '{\"Args\":[\"initiateBooks\", \"16171819\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
docker exec appraiser-cli bash -c "peer chaincode invoke -C books -n bookschaincode -c '{\"Args\":[\"initiateBooks\", \"22222\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e " ...........\e[5;32;40m  now running a query on all ledgers to dump the ledger data\e[m"
docker exec audit-cli bash -c "peer chaincode query -C records -n recordschaincode -c '{\"Args\":[\"queryAll\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_query_WAIT}
docker exec audit-cli bash -c "peer chaincode query -C lending -n lendingchaincode -c '{\"Args\":[\"queryAll\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_query_WAIT}
docker exec audit-cli bash -c "peer chaincode query -C books -n bookschaincode -c '{\"Args\":[\"queryAll\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
