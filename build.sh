#!/bin/bash

# Build the Docker image with build arguments
docker build \
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY=NEXT_PUBLIC_FIREBASE_API_KEY \
  --build-arg FIREBASE_PRIVATE_KEY="$(cat .env | grep FIREBASE_PRIVATE_KEY | cut -d "=" -f2-)" \
  --build-arg DATABASE_URL="$(cat .env | grep DATABASE_URL | cut -d "=" -f2-)" \
  --build-arg AWS_ACCESS_KEY_ID="$(cat .env | grep AWS_ACCESS_KEY_ID | cut -d "=" -f2)" \
  --build-arg AWS_SECRET_ACCESS_KEY="$(cat .env | grep AWS_SECRET_ACCESS_KEY | cut -d "=" -f2)" \
  -t kinderguardian-app . 