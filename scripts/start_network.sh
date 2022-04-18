#!/bin/bash
docker system prune
docker volume rm $(docker volume ls -q)
docker-compose -f docker-compose.yaml up
