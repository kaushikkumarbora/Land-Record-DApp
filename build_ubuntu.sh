#!/bin/bash
cp ./binary_ubuntu/* .
export FABRIC_CFG_PATH=$PWD
sh ./generate-certs-ubuntu.sh

