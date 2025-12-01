#!/bin/bash

###############################################################################
# Clean Planet - SSL Certificate Setup Script
# Let's Encrypt certificates via Certbot
# 
# This script will:
# - Obtain SSL certificates for all domains
# - Configure automatic renewal
# 
# Run this AFTER Nginx is configured and running
# Usage: sudo bash certbot-init.sh
###############################################################################

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}SSL Certificate Setup${NC}"
echo -e "${GREEN}================================${NC}\n"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root${NC}" 
   exit 1
fi

# Configuration
DOMAINS="clean.meybz.asia www.clean.meybz.asia crm.clean.meybz.asia"
EMAIL="your-email@example.com"  # Change this!
STAGING=0  # Set to 1 for testing

# Function to get certificate
get_certificate() {
    echo -e "${YELLOW}Obtaining SSL certificate for: $DOMAINS${NC}"
    
    # Build certbot command
    CMD="docker compose run --rm certbot certonly --webroot"
    CMD="$CMD --webroot-path=/var/www/certbot"
    CMD="$CMD --email $EMAIL"
    CMD="$CMD --agree-tos"
    CMD="$CMD --no-eff-email"
    
    if [ $STAGING -eq 1 ]; then
        CMD="$CMD --staging"
        echo -e "${YELLOW}Using Let's Encrypt STAGING environment (for testing)${NC}"
    fi
    
    # Add all domains
    for domain in $DOMAINS; do
        CMD="$CMD -d $domain"
    done
    
    # Execute
    eval $CMD
}

# Check if email is set
if [ "$EMAIL" == "your-email@example.com" ]; then
    echo -e "${RED}ERROR: Please edit this script and set your email address${NC}"
    echo -e "${YELLOW}Open the script and change the EMAIL variable${NC}"
    exit 1
fi

# Check if docker compose is available
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed${NC}"
    exit 1
fi

# Create necessary directories
echo -e "${YELLOW}Creating directories...${NC}"
mkdir -p volumes/certbot/{conf,www}

# Make sure Nginx is running
echo -e "${YELLOW}Starting Nginx container...${NC}"
docker compose up -d nginx

# Wait for Nginx
sleep 5

# Get certificate
get_certificate

# Reload Nginx to use new certificates
echo -e "${YELLOW}Reloading Nginx...${NC}"
docker compose exec nginx nginx -s reload

echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}SSL Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}\n"

echo -e "${YELLOW}Certificate information:${NC}"
docker compose run --rm certbot certificates

echo -e "\n${YELLOW}Certificates will auto-renew every 12 hours${NC}"
echo -e "${YELLOW}Check renewal logs with: docker compose logs certbot${NC}"

# Setup cron for renewal (optional, Docker will handle it)
echo -e "\n${GREEN}SSL certificates installed successfully!${NC}"
echo -e "${GREEN}Your site is now accessible via HTTPS${NC}"
