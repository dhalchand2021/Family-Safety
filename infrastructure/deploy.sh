#!/bin/bash

# Family Safety Platform - Deployment Script

echo "Starting Family Safety Platform deployment..."

# 1. Build Backend
echo "Building backend..."
cd backend
npm install
# npm run build # if using typescript/babel

# 2. Setup Infrastructure
echo "Setting up infrastructure..."
cd ../infrastructure
docker-compose up -d --build

# 3. Check logs
echo "Deployment complete. Checking logs..."
docker-compose logs -f backend
