#!/bin/bash
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker system prune
docker volume rm $(docker volume ls -q)
docker-compose -f docker-compose.yaml up
