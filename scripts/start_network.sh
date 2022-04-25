#!/bin/bash
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker volume rm $(docker volume ls -q)
docker rmi $(docker images -f reference=dev-* -q)
docker system prune
docker-compose -f docker-compose.yaml up
