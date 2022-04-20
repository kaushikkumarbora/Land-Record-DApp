docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker system prune
docker volume rm $(docker volume ls -q)
docker rmi $(docker images -f reference=dev-* -q)
rm -rf artifacts

rm -rf image/appraiserCA/ca
rm -rf image/appraiserCA/tlsca
rm -rf image/auditCA/ca
rm -rf image/auditCA/tlsca
rm -rf image/bankCA/ca
rm -rf image/bankCA/tlsca
rm -rf image/ficoCA/ca
rm -rf image/ficoCA/tlsca
rm -rf image/insuranceCA/ca
rm -rf image/insuranceCA/tlsca
rm -rf image/ordererCA/ca
rm -rf image/ordererCA/tlsca
rm -rf image/registryCA/ca
rm -rf image/registryCA/tlsca
rm -rf image/titleCA/ca
rm -rf image/titleCA/tlsca

rm -rf image/appraiserPeer/msp
rm -rf image/appraiserPeer/tls
rm -rf image/auditPeer/msp
rm -rf image/auditPeer/tls
rm -rf image/bankPeer/msp
rm -rf image/bankPeer/tls
rm -rf image/ficoPeer/msp
rm -rf image/ficoPeer/tls
rm -rf image/insurancePeer/msp
rm -rf image/insurancePeer/tls
rm -rf image/ordererPeer/msp
rm -rf image/ordererPeer/tls
rm -rf image/registryPeer/msp
rm -rf image/registryPeer/tls
rm -rf image/titlePeer/msp
rm -rf image/titlePeer/tls