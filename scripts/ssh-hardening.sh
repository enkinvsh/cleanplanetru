#!/bin/bash

###############################################################################
# Clean Planet - SSH Hardening Script
# 
# ⚠️  CRITICAL WARNING ⚠️
# This script will DISABLE password authentication for SSH!
# Make sure you have SSH keys configured BEFORE running this script.
# 
# This script will:
# - Disable root SSH login (use deploy user instead)
# - Disable password authentication (SSH keys only)
# - Change SSH default port (optional)
# - Restrict SSH protocol to version 2
# - Configure SSH key-based authentication
# 
# Usage: sudo bash ssh-hardening.sh
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${RED}================================${NC}"
echo -e "${RED}⚠️  SSH HARDENING SCRIPT ⚠️${NC}"
echo -e "${RED}================================${NC}\n"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root${NC}" 
   exit 1
fi

# Safety check - verify deploy user exists
if ! id -u deploy &>/dev/null; then
    echo -e "${RED}ERROR: deploy user does not exist!${NC}"
    echo -e "${RED}Please run server-setup.sh first${NC}"
    exit 1
fi

# Ask for confirmation
echo -e "${YELLOW}This script will:${NC}"
echo "1. Disable root SSH login"
echo "2. Disable password authentication (SSH keys ONLY)"
echo "3. Configure secure SSH settings"
echo ""
echo -e "${RED}After this script runs, you will NOT be able to login with password!${NC}"
echo -e "${YELLOW}Make sure you have SSH key configured for the 'deploy' user.${NC}"
echo ""
read -p "Do you want to continue? (yes/no): " -r
echo
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo -e "${YELLOW}Aborted.${NC}"
    exit 0
fi

# Backup original SSH config
echo -e "${YELLOW}[1/4] Backing up SSH configuration...${NC}"
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.$(date +%Y%m%d_%H%M%S)
echo -e "${GREEN}Backup created${NC}"

# Setup SSH keys for deploy user
echo -e "${YELLOW}[2/4] Setting up SSH keys for deploy user...${NC}"
DEPLOY_HOME="/home/deploy"
mkdir -p ${DEPLOY_HOME}/.ssh
chmod 700 ${DEPLOY_HOME}/.ssh

# If root has authorized_keys, copy to deploy user
if [ -f /root/.ssh/authorized_keys ]; then
    cp /root/.ssh/authorized_keys ${DEPLOY_HOME}/.ssh/authorized_keys
    chmod 600 ${DEPLOY_HOME}/.ssh/authorized_keys
    chown -R deploy:deploy ${DEPLOY_HOME}/.ssh
    echo -e "${GREEN}SSH keys copied from root to deploy user${NC}"
else
    touch ${DEPLOY_HOME}/.ssh/authorized_keys
    chmod 600 ${DEPLOY_HOME}/.ssh/authorized_keys
    chown -R deploy:deploy ${DEPLOY_HOME}/.ssh
    echo -e "${YELLOW}No SSH keys found for root. Please add your public key to:${NC}"
    echo -e "${YELLOW}${DEPLOY_HOME}/.ssh/authorized_keys${NC}"
fi

# Give deploy user sudo privileges
echo -e "${YELLOW}[3/4] Configuring sudo for deploy user...${NC}"
if ! grep -q "deploy ALL=(ALL) NOPASSWD:ALL" /etc/sudoers.d/deploy 2>/dev/null; then
    echo "deploy ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/deploy
    chmod 440 /etc/sudoers.d/deploy
    echo -e "${GREEN}Sudo configured for deploy user${NC}"
fi

# Configure SSH hardening
echo -e "${YELLOW}[4/4] Hardening SSH configuration...${NC}"

cat > /etc/ssh/sshd_config.d/99-cleanplanet-hardening.conf << 'EOF'
# Clean Planet SSH Hardening Configuration

# Disable root login
PermitRootLogin no

# Disable password authentication - SSH keys only!
PasswordAuthentication no
ChallengeResponseAuthentication no
UsePAM yes

# Disable empty passwords
PermitEmptyPasswords no

# SSH Protocol 2 only
Protocol 2

# Limit authentication attempts
MaxAuthTries 3
MaxSessions 5

# Login grace time
LoginGraceTime 30s

# Allow only specific users
AllowUsers deploy

# Disable X11 forwarding (security)
X11Forwarding no

# Disable TCP forwarding if not needed
# AllowTcpForwarding no

# Enable public key authentication
PubkeyAuthentication yes

# Disable host-based authentication
HostbasedAuthentication no
IgnoreRhosts yes

# Log level
LogLevel VERBOSE

# Client alive interval (prevent timeout)
ClientAliveInterval 300
ClientAliveCountMax 2

# Use privilege separation
UsePrivilegeSeparation sandbox

# Strict mode
StrictModes yes
EOF

echo -e "${GREEN}SSH hardening configuration created${NC}"

# Test SSH configuration
echo -e "${YELLOW}Testing SSH configuration...${NC}"
if sshd -t; then
    echo -e "${GREEN}SSH configuration is valid${NC}"
else
    echo -e "${RED}ERROR: SSH configuration has errors!${NC}"
    echo -e "${RED}Restoring backup...${NC}"
    rm /etc/ssh/sshd_config.d/99-cleanplanet-hardening.conf
    echo -e "${YELLOW}Configuration not applied. Please check manually.${NC}"
    exit 1
fi

# Restart SSH service
echo -e "${YELLOW}Restarting SSH service...${NC}"
systemctl restart sshd

echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}SSH Hardening Complete!${NC}"
echo -e "${GREEN}================================${NC}\n"

echo -e "${RED}⚠️  IMPORTANT NEXT STEPS ⚠️${NC}"
echo -e "${YELLOW}1. Test SSH connection in a NEW terminal (don't close this one!):${NC}"
echo -e "   ${GREEN}ssh deploy@\$(hostname -I | awk '{print \$1}')${NC}"
echo ""
echo -e "${YELLOW}2. If connection works, you can safely close this session${NC}"
echo ""
echo -e "${YELLOW}3. From now on, you must use the 'deploy' user:${NC}"
echo -e "   ${GREEN}ssh deploy@your-server-ip${NC}"
echo ""
echo -e "${RED}4. Root login via SSH is now DISABLED${NC}"
echo -e "${RED}5. Password authentication is now DISABLED${NC}"
echo ""
echo -e "${YELLOW}If you get locked out, you'll need to use the hosting provider's console!${NC}"

# Show current SSH key fingerprints
echo -e "\n${YELLOW}Authorized SSH keys for deploy user:${NC}"
if [ -s ${DEPLOY_HOME}/.ssh/authorized_keys ]; then
    while IFS= read -r key; do
        echo "$key" | ssh-keygen -l -f - 2>/dev/null || true
    done < ${DEPLOY_HOME}/.ssh/authorized_keys
else
    echo -e "${RED}No SSH keys found! Please add your public key to:${NC}"
    echo -e "${RED}${DEPLOY_HOME}/.ssh/authorized_keys${NC}"
fi
