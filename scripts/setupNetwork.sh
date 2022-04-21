#!/bin/bash


sh scripts/createChannels.sh
sleep 5

sh scripts/checkOrgChannelSubscription.sh
sleep 5

sh scripts/chaincodeInstallInstantiate.sh
sleep 5

sh scripts/createLedgerEntries.sh
sleep 5
