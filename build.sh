#!/bin/bash

# Build Docker images
docker build -t bettrdash-api-gateway ./apps/api-gateway
docker build -t bettrdash-web-api ./apps/web-api
docker build -t bettrdash-api ./apps/api

# Tag the images for Fly.io registry
docker tag bettrdash-api-gateway registry.fly.io/bettrdash-api-gateway
docker tag bettrdash-web-api registry.fly.io/bettrdash-web-api
docker tag bettrdash-api registry.fly.io/bettrdash-api
