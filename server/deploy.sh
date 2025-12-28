#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Navigate to project root (assuming script is in server directory)
cd "$(dirname "$0")/.."

echo -e "${BLUE}📦 Building frontend...${NC}"
cd client
npm install
npm run build
echo -e "${GREEN}✅ Frontend built successfully${NC}"

echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
cd ../server
npm install --production
echo -e "${GREEN}✅ Backend dependencies installed${NC}"

# Copy frontend build to web directory (adjust path as needed)
if [ -d "/var/www/brewvibe" ]; then
    echo -e "${BLUE}📂 Copying frontend files to /var/www/brewvibe...${NC}"
    sudo cp -r ../client/dist/* /var/www/brewvibe/
    sudo chown -R www-data:www-data /var/www/brewvibe
    echo -e "${GREEN}✅ Frontend files copied${NC}"
fi

echo -e "${BLUE}🔄 Restarting PM2...${NC}"
pm2 restart brewvibe-api || pm2 start ecosystem.config.js
pm2 save
echo -e "${GREEN}✅ PM2 restarted${NC}"

echo -e "${BLUE}🔄 Reloading Nginx...${NC}"
sudo nginx -t && sudo systemctl reload nginx
echo -e "${GREEN}✅ Nginx reloaded${NC}"

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}📊 PM2 Status:${NC}"
pm2 status

