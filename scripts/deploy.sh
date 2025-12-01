#!/bin/bash

###############################################################################
# Clean Planet - Deployment Script
# 
# This script automates the deployment process:
# - Pull latest code from Git
# - Rebuild Docker containers
# - Run health checks
# 
# Usage: ./deploy.sh
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Clean Planet Deployment${NC}"
echo -e "${GREEN}================================${NC}\n"

# Configuration
PROJECT_DIR="/opt/cleanplanet"
BRANCH="main"

# Change to project directory
cd "$PROJECT_DIR" || exit 1

# Pull latest code
echo -e "${YELLOW}[1/5] Pulling latest code from Git...${NC}"
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}ERROR: .env.production not found!${NC}"
    echo -e "${YELLOW}Please create .env.production before deploying${NC}"
    exit 1
fi

# Use production env
cp .env.production .env

# Stop containers
echo -e "${YELLOW}[2/5] Stopping containers...${NC}"
docker compose down

# Build and start containers
echo -e "${YELLOW}[3/5] Building and starting containers...${NC}"
docker compose build --no-cache frontend
docker compose up -d

# Wait for services to start
echo -e "${YELLOW}[4/5] Waiting for services to start...${NC}"
sleep 15

# Health checks
echo -e "${YELLOW}[5/5] Running health checks...${NC}"

# Check if containers are running
CONTAINERS=("cleanplanet_db" "cleanplanet_crm" "cleanplanet_frontend" "cleanplanet_nginx")
ALL_RUNNING=true

for container in "${CONTAINERS[@]}"; do
    if docker ps | grep -q "$container"; then
        echo -e "${GREEN}✓ $container is running${NC}"
    else
        echo -e "${RED}✗ $container is NOT running${NC}"
        ALL_RUNNING=false
    fi
done

# Check HTTP endpoints
echo -e "\n${YELLOW}Checking HTTP endpoints...${NC}"

if curl -f -s http://localhost:80/health > /dev/null; then
    echo -e "${GREEN}✓ Nginx health check passed${NC}"
else
    echo -e "${RED}✗ Nginx health check failed${NC}"
    ALL_RUNNING=false
fi

if curl -f -s http://localhost:3000/api/health > /dev/null; then
    echo -e "${GREEN}✓ Frontend health check passed${NC}"
else
    echo -e "${RED}✗ Frontend health check failed${NC}"
    ALL_RUNNING=false
fi

# Show logs if something failed
if [ "$ALL_RUNNING" = false ]; then
    echo -e "\n${RED}Deployment failed! Showing recent logs:${NC}"
    docker compose logs --tail=50
    exit 1
fi

echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}Deployment Successful!${NC}"
echo -e "${GREEN}================================${NC}\n"

echo -e "${YELLOW}Deployed commit:${NC} $(git rev-parse --short HEAD)"
echo -e "${YELLOW}Branch:${NC} $BRANCH"
echo -e "${YELLOW}Time:${NC} $(date)"

echo -e "\n${YELLOW}To view logs:${NC} docker compose logs -f"
echo -e "${YELLOW}To restart:${NC} docker compose restart"
