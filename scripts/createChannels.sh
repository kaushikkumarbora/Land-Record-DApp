#!/bin/bash

export FABRIC_START_WAIT=5

echo -e "-------------------------\e[5;32;40mNow Creating channels\e[m -----------------------------"
docker exec registry-cli bash -c 'peer channel create -c records -f ./channels/Records.tx -o orderer0:7050 --tls --cafile $ORDERER_TLS_ROOTCERT_FILE --clientauth --certfile $ORDERER_TLS_CLIENTCERT_FILE --keyfile $ORDERER_TLS_CLIENTKEY_FILE --outputBlock channels/records.block'
sleep ${FABRIC_START_WAIT}
docker exec registry-cli bash -c 'peer channel join -b ./channels/records.block'
sleep ${FABRIC_START_WAIT}

docker exec  bank-cli bash -c 'peer channel create -c lending -f ./channels/Lending.tx -o orderer0:7050 --tls --cafile $ORDERER_TLS_ROOTCERT_FILE --clientauth --certfile $ORDERER_TLS_CLIENTCERT_FILE --keyfile $ORDERER_TLS_CLIENTKEY_FILE --outputBlock channels/lending.block'
sleep ${FABRIC_START_WAIT}
docker exec  bank-cli bash -c 'peer channel join -b ./channels/lending.block'
sleep ${FABRIC_START_WAIT}

docker exec  revenue-cli bash -c 'peer channel create -c registration -f ./channels/Registration.tx -o orderer0:7050 --tls --cafile $ORDERER_TLS_ROOTCERT_FILE --clientauth --certfile $ORDERER_TLS_CLIENTCERT_FILE --keyfile $ORDERER_TLS_CLIENTKEY_FILE --outputBlock channels/registration.block'
sleep ${FABRIC_START_WAIT}
docker exec  revenue-cli bash -c 'peer channel join -b ./channels/registration.block'

sleep ${FABRIC_START_WAIT}
echo -e "-------------------------\e[5;32;40mNow Joining channels\e[m -----------------------------"
#Registry joins all channels, but we already joined records
docker exec registry-cli bash -c 'peer channel join -b ./channels/registration.block'
sleep ${FABRIC_START_WAIT}
docker exec registry-cli bash -c 'peer channel join -b ./channels/lending.block'
sleep ${FABRIC_START_WAIT}

#bank  joins all channels, but we already joined lending when we created it,  so join the other two
docker exec bank-cli bash -c 'peer channel join -b ./channels/records.block'
sleep ${FABRIC_START_WAIT}
docker exec bank-cli bash -c 'peer channel join -b ./channels/registration.block'
sleep ${FABRIC_START_WAIT}

#Appraiser  joins 2 channels, lendin and records
docker exec appraiser-cli bash -c 'peer channel join -b ./channels/records.block'
sleep ${FABRIC_START_WAIT}
docker exec appraiser-cli bash -c 'peer channel join -b ./channels/lending.block'
sleep ${FABRIC_START_WAIT}

#Revenue  joins 3 channels, but we already joined registration
docker exec revenue-cli bash -c 'peer channel join -b ./channels/records.block'
sleep ${FABRIC_START_WAIT}
docker exec revenue-cli bash -c 'peer channel join -b ./channels/lending.block'
sleep ${FABRIC_START_WAIT}

#Insurance  joins lending and records channels
docker exec insurance-cli bash -c 'peer channel join -b ./channels/records.block'
sleep ${FABRIC_START_WAIT}
docker exec insurance-cli bash -c 'peer channel join -b ./channels/lending.block'
sleep ${FABRIC_START_WAIT}

#Municipal  joins registration and records channels
docker exec municipal-cli bash -c 'peer channel join -b ./channels/records.block'
sleep ${FABRIC_START_WAIT}
docker exec municipal-cli bash -c 'peer channel join -b ./channels/registration.block'
sleep ${FABRIC_START_WAIT}

#Audit  joins all channels
docker exec audit-cli bash -c 'peer channel join -b ./channels/records.block'
sleep ${FABRIC_START_WAIT}
docker exec audit-cli bash -c 'peer channel join -b ./channels/lending.block'
sleep ${FABRIC_START_WAIT}
docker exec audit-cli bash -c 'peer channel join -b ./channels/registration.block'
sleep ${FABRIC_START_WAIT}

#Fico  joins 1 channels,
docker exec fico-cli bash -c 'peer channel join -b ./channels/lending.block'
sleep ${FABRIC_START_WAIT}


echo -e ".. \e[5;32;40mlet us use the anchor peer update transactions:\e[m"

docker exec bank-cli bash -c 'peer channel update -o orderer0:7050 -c lending -f ./channels/lendinganchor.tx --tls --cafile $ORDERER_TLS_ROOTCERT_FILE --clientauth --certfile $ORDERER_TLS_CLIENTCERT_FILE --keyfile $ORDERER_TLS_CLIENTKEY_FILE'
sleep ${FABRIC_START_WAIT}
docker exec revenue-cli bash -c 'peer channel update -o orderer0:7050 -c registration -f ./channels/registrationanchor.tx --tls --cafile $ORDERER_TLS_ROOTCERT_FILE --clientauth --certfile $ORDERER_TLS_CLIENTCERT_FILE --keyfile $ORDERER_TLS_CLIENTKEY_FILE'
sleep ${FABRIC_START_WAIT}
docker exec registry-cli bash -c 'peer channel update -o orderer0:7050 -c records -f ./channels/recordsanchor.tx --tls --cafile $ORDERER_TLS_ROOTCERT_FILE --clientauth --certfile $ORDERER_TLS_CLIENTCERT_FILE --keyfile $ORDERER_TLS_CLIENTKEY_FILE'
