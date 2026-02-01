# SiteBotGPT - VPS Deployment Guide

**Production website:** [https://sitebotgpt.com](https://sitebotgpt.com)

This guide covers deploying SiteBotGPT on a single VPS with Nginx and PM2.

## Prerequisites

- Ubuntu 22.04 (or similar) VPS
- Domain pointed to your server
- Node.js 20+ and npm

## 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation
```

## 2. MySQL Database

```bash
sudo mysql
```

```sql
CREATE DATABASE project_atlas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'atlas'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON project_atlas.* TO 'atlas'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 3. Application Setup

```bash
# Clone or upload your project
cd /var/www
sudo mkdir -p project-atlas
sudo chown $USER:$USER project-atlas
cd project-atlas

# If using git
git clone <your-repo> .
# Or upload files via scp/sftp

npm install
npm run build
```

## 4. Environment Variables

```bash
cp .env.example .env
nano .env
```

Set:

```
DATABASE_URL="mysql://atlas:your_strong_password@localhost:3306/project_atlas"
NEXTAUTH_URL="https://sitebotgpt.com"
AUTH_SECRET="<generate with: openssl rand -base64 32>"
OPENAI_API_KEY="sk-..."
NEXT_PUBLIC_APP_URL="https://sitebotgpt.com"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## 5. Database Migration

```bash
npx prisma db push
# or: npx prisma migrate deploy
```

## 6. PM2

```bash
sudo npm install -g pm2
pm2 start npm --name "atlas" -- start
pm2 save
pm2 startup
```

Create `ecosystem.config.cjs` for better control:

```javascript
module.exports = {
  apps: [{
    name: 'atlas',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/project-atlas',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

Then: `pm2 start ecosystem.config.cjs`

## 7. Nginx

```bash
sudo apt install -g nginx
sudo nano /etc/nginx/sites-available/atlas
```

```nginx
server {
    listen 80;
    server_name sitebotgpt.com www.sitebotgpt.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    location /uploads {
        alias /var/www/project-atlas/public/uploads;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/atlas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 8. SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d sitebotgpt.com -d www.sitebotgpt.com
```

## 9. Upload Directory

Ensure the uploads directory exists and is writable:

```bash
mkdir -p /var/www/project-atlas/public/uploads
chmod 755 /var/www/project-atlas/public/uploads
```

## 10. Maintenance

```bash
# View logs
pm2 logs atlas

# Restart
pm2 restart atlas

# Update deployment
cd /var/www/project-atlas
git pull
npm install
npm run build
pm2 restart atlas
npx prisma migrate deploy  # if migrations exist
```

## Security Checklist

- [ ] Firewall: `ufw allow 80,443` and `ufw enable`
- [ ] Strong database password
- [ ] AUTH_SECRET is random and secret
- [ ] OpenAI API key not exposed to client
- [ ] Rate limiting enabled (built-in for chat API)
