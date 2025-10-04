# Deployment Guide - Yellow Cross

## 🚀 Deployment Overview

This guide covers deploying Yellow Cross to production environments, including cloud platforms and on-premises infrastructure.

## 📋 Pre-Deployment Checklist

### 1. Security Review
- [ ] All secrets stored in environment variables (not in code)
- [ ] Strong passwords generated for all services
- [ ] JWT_SECRET changed from default
- [ ] SSL/TLS certificates obtained
- [ ] Firewall rules configured
- [ ] Rate limiting configured appropriately
- [ ] CORS origins restricted to production domains
- [ ] MFA enabled for admin accounts

### 2. Environment Configuration
- [ ] `.env` file configured for production
- [ ] `NODE_ENV=production` set
- [ ] Database connection string updated
- [ ] SMTP credentials configured
- [ ] API keys for integrations configured
- [ ] Backup strategy configured

### 3. Infrastructure
- [ ] PostgreSQL database provisioned
- [ ] Database backups configured
- [ ] Monitoring tools set up
- [ ] Log aggregation configured
- [ ] CDN configured (if needed)
- [ ] Load balancer configured (for scaling)

### 4. Testing
- [ ] All tests passing (`npm test`)
- [ ] Manual testing completed
- [ ] Performance testing completed
- [ ] Security scan completed
- [ ] Backup/restore tested

## 🏗️ Deployment Architectures

### Option 1: Docker Deployment (Recommended)

Best for: Most production environments, easy scaling, consistent deployments

**Architecture:**
```
┌─────────────────────────────────────────┐
│         Load Balancer (Optional)        │
└────────────────┬────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼────────┐         ┌──────▼──────┐
│  App Node  │         │  App Node   │
│  (Docker)  │         │  (Docker)   │
└────┬───────┘         └──────┬──────┘
     │                        │
     └────────┬───────────────┘
              │
    ┌─────────▼──────────┐
    │   PostgreSQL DB    │
    │    (Managed/RDS)   │
    └────────────────────┘
```

**Steps:**

1. **Build Docker Image**
   ```bash
   docker build -t yellow-cross:latest .
   ```

2. **Configure Environment**
   ```bash
   # Create .env file with production values
   cp .env.example .env
   # Edit .env with production credentials
   ```

3. **Deploy with Docker Compose**
   ```bash
   # Production docker-compose.yml
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Run Database Migrations**
   ```bash
   npm run prisma:migrate:deploy
   ```

5. **Verify Deployment**
   ```bash
   curl http://localhost:3000/health
   ```

### Option 2: Cloud Platform Deployment

#### AWS Deployment

**Services Used:**
- **EC2/ECS**: Application hosting
- **RDS PostgreSQL**: Database
- **S3**: File storage
- **CloudFront**: CDN
- **Route 53**: DNS
- **ALB**: Load balancing

**Steps:**

1. **Provision RDS PostgreSQL**
   ```bash
   # Via AWS Console or CLI
   aws rds create-db-instance \
     --db-instance-identifier yellowcross-prod \
     --db-instance-class db.t3.medium \
     --engine postgres \
     --master-username admin \
     --master-user-password <secure-password> \
     --allocated-storage 100
   ```

2. **Deploy to ECS**
   ```bash
   # Push image to ECR
   aws ecr get-login-password | docker login --username AWS --password-stdin <ecr-url>
   docker tag yellow-cross:latest <ecr-url>/yellow-cross:latest
   docker push <ecr-url>/yellow-cross:latest
   
   # Deploy to ECS (via AWS Console or Terraform)
   ```

3. **Configure ALB**
   - Create target group
   - Configure health check: `/health`
   - Set up SSL/TLS certificate
   - Configure routing rules

#### Azure Deployment

**Services Used:**
- **App Service**: Application hosting
- **Azure Database for PostgreSQL**: Database
- **Blob Storage**: File storage
- **CDN**: Content delivery
- **Application Gateway**: Load balancing

**Steps:**

1. **Create App Service**
   ```bash
   az webapp create \
     --resource-group yellow-cross-rg \
     --plan yellow-cross-plan \
     --name yellow-cross-app \
     --runtime "NODE|18-lts"
   ```

2. **Provision PostgreSQL**
   ```bash
   az postgres server create \
     --resource-group yellow-cross-rg \
     --name yellowcross-db \
     --sku-name GP_Gen5_2 \
     --version 15
   ```

3. **Deploy Application**
   ```bash
   az webapp deployment source config-zip \
     --resource-group yellow-cross-rg \
     --name yellow-cross-app \
     --src ./release.zip
   ```

#### Google Cloud Platform (GCP)

**Services Used:**
- **Cloud Run**: Containerized application
- **Cloud SQL**: PostgreSQL database
- **Cloud Storage**: File storage
- **Cloud CDN**: Content delivery
- **Cloud Load Balancing**: Load balancing

**Steps:**

1. **Build and Push to GCR**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT-ID/yellow-cross
   ```

2. **Create Cloud SQL Instance**
   ```bash
   gcloud sql instances create yellowcross-db \
     --database-version=POSTGRES_15 \
     --tier=db-n1-standard-2 \
     --region=us-central1
   ```

3. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy yellow-cross \
     --image gcr.io/PROJECT-ID/yellow-cross \
     --platform managed \
     --region us-central1 \
     --add-cloudsql-instances PROJECT-ID:REGION:yellowcross-db
   ```

### Option 3: On-Premises Deployment

Best for: Organizations with strict data residency requirements

**Architecture:**
```
┌─────────────────┐
│  Reverse Proxy  │  (nginx/Apache)
│    (SSL/TLS)    │
└────────┬────────┘
         │
┌────────▼────────┐
│   Node.js App   │
│  (PM2/systemd)  │
└────────┬────────┘
         │
┌────────▼────────┐
│   PostgreSQL    │
│   (Local/VM)    │
└─────────────────┘
```

**Steps:**

1. **Install Prerequisites**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PostgreSQL
   sudo apt-get install -y postgresql postgresql-contrib
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Setup PostgreSQL**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE yellowcross;
   CREATE USER yellowcross WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE yellowcross TO yellowcross;
   ```

3. **Deploy Application**
   ```bash
   # Clone/copy application files
   cd /opt/yellow-cross
   npm install --production
   
   # Configure environment
   cp .env.example .env
   # Edit .env with production values
   
   # Run migrations
   npm run prisma:migrate:deploy
   
   # Start with PM2
   pm2 start backend/src/index.js --name yellow-cross
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name yellowcross.example.com;
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl http2;
       server_name yellowcross.example.com;
       
       ssl_certificate /etc/ssl/certs/yellowcross.crt;
       ssl_certificate_key /etc/ssl/private/yellowcross.key;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run security audit
      run: npm audit --audit-level=high
    
    - name: Build Docker image
      run: docker build -t yellow-cross:${{ github.sha }} .
    
    - name: Push to registry
      run: |
        docker tag yellow-cross:${{ github.sha }} registry.example.com/yellow-cross:latest
        docker push registry.example.com/yellow-cross:latest
    
    - name: Deploy to production
      run: |
        # Deploy commands here
        # e.g., kubectl apply, docker-compose, etc.
```

## 📊 Monitoring & Logging

### Application Monitoring

**Recommended Tools:**
- **New Relic**: Full-stack observability
- **Datadog**: Infrastructure monitoring
- **Prometheus + Grafana**: Open-source monitoring

**Setup with PM2:**
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 30
```

### Health Checks

The application provides health check endpoints:
```bash
# Basic health check
GET /health

# Detailed health check
GET /health/detailed
```

Response:
```json
{
  "status": "healthy",
  "uptime": 3600,
  "database": "connected",
  "timestamp": "2024-01-20T10:30:00Z"
}
```

### Log Aggregation

**Winston Configuration** (already implemented):
```javascript
// Logs to:
// - Console (development)
// - File: ./logs/app.log
// - Rotate daily, keep 30 days
```

**External Log Services:**
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Splunk**
- **CloudWatch Logs** (AWS)
- **Azure Monitor Logs**
- **Google Cloud Logging**

## 🔐 SSL/TLS Configuration

### Let's Encrypt (Free SSL)

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yellowcross.example.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Custom SSL Certificate

Place certificates in:
```
/etc/ssl/certs/yellowcross.crt
/etc/ssl/private/yellowcross.key
```

## 🔄 Database Backup & Recovery

### Automated Backups

**Using cron (Linux):**
```bash
# Add to crontab
0 2 * * * /opt/yellow-cross/scripts/backup-db.sh

# backup-db.sh
#!/bin/bash
BACKUP_DIR="/backups/yellowcross"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U yellowcross yellowcross | gzip > "$BACKUP_DIR/backup_$DATE.sql.gz"
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

**Using AWS RDS:**
```bash
# Enable automated backups
aws rds modify-db-instance \
  --db-instance-identifier yellowcross-prod \
  --backup-retention-period 30 \
  --preferred-backup-window "02:00-03:00"
```

### Database Recovery

```bash
# Restore from backup
gunzip -c backup_20240120.sql.gz | psql -U yellowcross yellowcross
```

## 🔄 Rollback Procedures

### Docker Rollback

```bash
# Tag current as backup
docker tag yellow-cross:latest yellow-cross:backup

# Pull and deploy previous version
docker pull registry.example.com/yellow-cross:previous
docker-compose down
docker-compose up -d
```

### Database Rollback

```bash
# Prisma migrations support rollback
cd backend
npx prisma migrate resolve --rolled-back <migration-name>
```

## 📈 Scaling

### Horizontal Scaling

**Requirements:**
- Load balancer
- Shared session storage (Redis)
- Shared file storage (S3/NFS)

**Docker Compose Example:**
```yaml
version: '3.8'
services:
  app:
    image: yellow-cross:latest
    deploy:
      replicas: 3
    environment:
      - NODE_ENV=production
  
  postgres:
    image: postgres:15
    
  redis:
    image: redis:7
```

### Vertical Scaling

Increase container resources:
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
```

## 🚨 Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs yellow-cross
# or
docker-compose logs app

# Common issues:
# - Database connection: Check DATABASE_URL
# - Port in use: Check PORT setting
# - Missing env vars: Review .env file
```

### Database Connection Issues

```bash
# Test database connectivity
psql -h hostname -U username -d yellowcross

# Check Prisma connection
cd backend
npx prisma db pull
```

### Performance Issues

```bash
# Check application metrics
pm2 monit

# Check database performance
psql -U yellowcross yellowcross -c "SELECT * FROM pg_stat_activity;"
```

## 📞 Support

For deployment assistance:
- **Documentation**: See docs/README.md
- **DevOps Team**: devops@yellowcross.com
- **Emergency**: 24/7 on-call rotation

---

**Last Updated**: 2024
**Version**: 1.0
