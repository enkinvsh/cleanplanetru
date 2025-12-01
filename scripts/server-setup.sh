#!/bin/bash

###############################################################################
# Clean Planet - Server Initial Setup Script
# Ubuntu 24.04 LTS
# 
# This script will:
# - Update system packages
# - Install Docker and Docker Compose
# - Configure UFW firewall
# - Install fail2ban
# - Setup automatic security updates
# - Create deployment user
# 
# Usage: sudo bash server-setup.sh
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Clean Planet Server Setup${NC}"
echo -e "${GREEN}================================${NC}\n"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root${NC}" 
   exit 1
fi

# Update system
echo -e "${YELLOW}[1/8] Updating system packages...${NC}"
apt-get update
apt-get upgrade -y
apt-get dist-upgrade -y

# Install essential packages
echo -e "${YELLOW}[2/8] Installing essential packages...${NC}"
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    software-properties-common \
    ufw \
    fail2ban \
    unattended-upgrades \
    git \
    htop \
    vim \
    net-tools

# Install Docker
echo -e "${YELLOW}[3/8] Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    # Add Docker's official GPG key
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc
    
    # Add Docker repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Enable Docker service
    systemctl enable docker
    systemctl start docker
    
    echo -e "${GREEN}Docker installed successfully${NC}"
else
    echo -e "${GREEN}Docker already installed${NC}"
fi

# Verify Docker Compose
docker compose version

# Configure UFW Firewall
echo -e "${YELLOW}[4/8] Configuring UFW firewall...${NC}"
ufw --force disable  # Reset firewall
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (IMPORTANT!)
ufw allow 22/tcp comment 'SSH'

# Allow HTTP and HTTPS
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'

# Enable firewall
ufw --force enable

echo -e "${GREEN}Firewall configured. Allowed ports: 22, 80, 443${NC}"
ufw status verbose

# Configure fail2ban
echo -e "${YELLOW}[5/8] Configuring fail2ban...${NC}"
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
banaction = ufw

[sshd]
enabled = true
port = 22
logpath = %(sshd_log)s
backend = %(sshd_backend)s
EOF

systemctl enable fail2ban
systemctl restart fail2ban

echo -e "${GREEN}fail2ban configured${NC}"

# Configure automatic updates
echo -e "${YELLOW}[6/8] Configuring automatic security updates...${NC}"
cat > /etc/apt/apt.conf.d/50unattended-upgrades << 'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
    "${distro_id}ESM:${distro_codename}-infra-security";
};

Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
EOF

cat > /etc/apt/apt.conf.d/20auto-upgrades << 'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
APT::Periodic::Unattended-Upgrade "1";
EOF

echo -e "${GREEN}Automatic updates configured${NC}"

# Create deploy user
echo -e "${YELLOW}[7/8] Creating deploy user...${NC}"
if ! id -u deploy &>/dev/null; then
    useradd -m -s /bin/bash -G docker deploy
    echo -e "${GREEN}User 'deploy' created and added to docker group${NC}"
else
    echo -e "${GREEN}User 'deploy' already exists${NC}"
fi

# Create directory for the application
echo -e "${YELLOW}[8/8] Creating application directory...${NC}"
mkdir -p /opt/cleanplanet
chown deploy:deploy /opt/cleanplanet

echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}Server setup completed!${NC}"
echo -e "${GREEN}================================${NC}\n"

echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Run ${GREEN}./ssh-hardening.sh${NC} to secure SSH access (IMPORTANT!)"
echo -e "2. Clone repository to /opt/cleanplanet"
echo -e "3. Configure .env.production file"
echo -e "4. Run docker compose up -d"
echo -e "\n${RED}WARNING: Before running ssh-hardening.sh, make sure you have SSH keys configured!${NC}"

# System info
echo -e "\n${YELLOW}System Information:${NC}"
echo "Docker version: $(docker --version)"
echo "Docker Compose version: $(docker compose version)"
echo "UFW status:"
ufw status numbered
