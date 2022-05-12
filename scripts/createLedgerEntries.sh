#!/bin/bash

export FABRIC_START_WAIT=2
  export FABRIC_query_WAIT=5


echo -e "------------------------\e[5;32;40mNow creating real estates on the records blockchain\e[m ----------------------------------------------------"
sleep ${FABRIC_START_WAIT}

docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"createRealEstate\", \"123\", \"5 High Strret, TX 75000 \", \"52.972459\", \"42.279546\", \"100\", \"100\", \"10000\", \"John Doe\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"

docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"createRealEstate\", \"456\", \"6 Low Strret, FL 75001 \", \"52.972459\", \"42.279546\", \"100\", \"100\", \"10000\", \"Alice Monet\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"

docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"createRealEstate\", \"789\", \"7 High Strret, CA 75002 \", \"52.972459\", \"42.279546\", \"100\", \"100\", \"10000\", \"Papa John\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"

docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"createRealEstate\", \"1234\", \"8 High Strret, MA 75003 \", \"52.972459\", \"42.279546\", \"100\", \"100\", \"10000\", \"Hooters\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"

docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"createRealEstate\", \"4567\", \"9 High Strret, LA 75004 \", \"52.972459\", \"42.279546\", \"100\", \"100\", \"10000\", \"Bill Gates\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"

docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"createRealEstate\", \"11111\", \"10 High Strret, LA 75004 \", \"52.972459\", \"42.279546\", \"100\", \"100\", \"10000\", \"Doug Gates\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"

docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"createRealEstate\", \"891011\", \"11 High Strret, LA 75004 \", \"52.972459\", \"42.279546\", \"100\", \"100\", \"10000\", \"Hillary \"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"

docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"createRealEstate\", \"12131415\", \"12 High Strret, LA 75004 \", \"52.972459\", \"42.279546\", \"100\", \"100\", \"10000\", \"Billy Bob \"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"

docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"createRealEstate\", \"16171819\", \"5 High Strret, LA 75004 \", \"52.972459\", \"42.279546\", \"100\", \"100\", \"10000\", \"Vik Thor\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"

docker exec registry-cli bash -c "peer chaincode invoke -C records -n recordschaincode -c '{\"Args\":[\"createRealEstate\", \"22222\", \"5 High Strret, LA 75004 \", \"52.972459\", \"42.279546\", \"100\", \"100\", \"10000\", \"The man\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_START_WAIT}

echo -e " ...........\e[5;32;40m  now running a query on all ledgers to dump the ledger data\e[m"
docker exec audit-cli bash -c "peer chaincode query -C records -n recordschaincode -c '{\"Args\":[\"queryAll\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_query_WAIT}
docker exec audit-cli bash -c "peer chaincode query -C lending -n lendingchaincode -c '{\"Args\":[\"queryAll\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
sleep ${FABRIC_query_WAIT}
docker exec audit-cli bash -c "peer chaincode query -C registration -n registrationchaincode -c '{\"Args\":[\"queryAll\"]}' --tls --cafile \$ORDERER_TLS_ROOTCERT_FILE"
