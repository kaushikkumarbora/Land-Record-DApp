#!/bin/bash

export FABRIC_START_WAIT=5
echo -e '******\e[5;32;40mList of orgs and their subscriptions to lending registration and records blockchain\e[m************************************'

echo -e '******\e[5;32;40mBank (lending, records, registration channels)\e[m************************************'
docker exec bank-cli bash -c 'peer channel list'
sleep ${FABRIC_START_WAIT}
echo -e '******\e[5;32;40mInsurance  (lending, records channels)\e[m************************************'
docker exec insurance-cli bash -c 'peer channel list'
sleep ${FABRIC_START_WAIT}
echo -e '******\e[5;32;40mMunicipal  (records and registration channels)\e[m************************************'
docker exec municipal-cli bash -c 'peer channel list'
sleep ${FABRIC_START_WAIT}
echo -e '******\e[5;32;40mRegistry (records channel)\e[m************************************'
docker exec registry-cli bash -c 'peer channel list'
sleep ${FABRIC_START_WAIT}
echo -e '******\e[5;32;40mRevenue (lending, records, registration channels)\e[m************************************'
docker exec revenue-cli bash -c 'peer channel list'
sleep ${FABRIC_START_WAIT}
echo -e '******\e[5;32;40mFico (lending channel)\e[m************************************'
docker exec fico-cli bash -c 'peer channel list'
sleep ${FABRIC_START_WAIT}
echo -e '******\e[5;32;40mAppraiser (lending channels)\e[m************************************'
docker exec appraiser-cli bash -c 'peer channel list'
sleep ${FABRIC_START_WAIT}
echo -e '******\e[5;32;40mAudit (lending, records, registration channels)\e[m************************************'
docker exec audit-cli bash -c 'peer channel list'
