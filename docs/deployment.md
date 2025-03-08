# TravelShield Deployment Guide

## Deployment Options

TravelShield can be deployed in several ways:

1. Traditional VPS/Dedicated Server
2. Docker Containers
3. Kubernetes Cluster
4. Cloud Platform (AWS, GCP, Azure)

This guide covers all deployment options.

## Prerequisites

- Node.js 14.0.0 or higher
- MongoDB 4.4 or higher
- Redis 6.0 or higher
- SSL certificate
- Domain name
- CI/CD pipeline (optional)

## 1. Traditional Deployment

### Server Requirements

- 2 CPU cores minimum
- 4GB RAM minimum
- 20GB SSD storage
- Ubuntu 20.04 LTS

### Setup Steps

1. **Server Preparation**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

2. **Application Deployment**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/travelshield.git
   cd travelshield

   # Install PM2
   sudo npm install -g pm2

   # Backend setup
   cd backend
   npm install
   npm run build
   
   # Start backend with PM2
   pm2 start ecosystem.config.js

   # Frontend setup
   cd ../frontend
   npm install
   npm run build
   ```

3. **Nginx Configuration**
   ```nginx
   # /etc/nginx/sites-available/travelshield
   server {
       listen 80;
       server_name your-domain.com;

       # Frontend
       location / {
           root /path/to/frontend/build;
           try_files $uri $uri/ /index.html;
       }

       # Backend API
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 2. Docker Deployment

### Prerequisites
- Docker
- Docker Compose
- Docker Registry (optional)

### Setup Steps

1. **Build Docker Images**
   ```bash
   # Build backend
   cd backend
   docker build -t travelshield-backend .

   # Build frontend
   cd ../frontend
   docker build -t travelshield-frontend .
   ```

2. **Docker Compose Configuration**
   ```yaml
   # docker-compose.yml
   version: '3.8'

   services:
     backend:
       image: travelshield-backend
       ports:
         - "5000:5000"
       environment:
         - NODE_ENV=production
         - MONGODB_URI=mongodb://mongodb:27017/travelshield
       depends_on:
         - mongodb
         - redis

     frontend:
       image: travelshield-frontend
       ports:
         - "80:80"
       depends_on:
         - backend

     mongodb:
       image: mongo:4.4
       volumes:
         - mongodb_data:/data/db

     redis:
       image: redis:6
       volumes:
         - redis_data:/data

   volumes:
     mongodb_data:
     redis_data:
   ```

3. **Start Services**
   ```bash
   docker-compose up -d
   ```

## 3. Kubernetes Deployment

### Prerequisites
- Kubernetes cluster
- kubectl
- Helm (optional)

### Kubernetes Manifests

1. **Backend Deployment**
   ```yaml
   # backend-deployment.yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: travelshield-backend
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: travelshield-backend
     template:
       metadata:
         labels:
           app: travelshield-backend
       spec:
         containers:
         - name: backend
           image: travelshield-backend:latest
           ports:
           - containerPort: 5000
           env:
           - name: MONGODB_URI
             valueFrom:
               secretKeyRef:
                 name: mongodb-secret
                 key: uri
   ```

2. **Frontend Deployment**
   ```yaml
   # frontend-deployment.yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: travelshield-frontend
   spec:
     replicas: 2
     selector:
       matchLabels:
         app: travelshield-frontend
     template:
       metadata:
         labels:
           app: travelshield-frontend
       spec:
         containers:
         - name: frontend
           image: travelshield-frontend:latest
           ports:
           - containerPort: 80
   ```

3. **Services**
   ```yaml
   # services.yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: travelshield-backend
   spec:
     selector:
       app: travelshield-backend
     ports:
     - port: 5000
       targetPort: 5000
   ---
   apiVersion: v1
   kind: Service
   metadata:
     name: travelshield-frontend
   spec:
     selector:
       app: travelshield-frontend
     ports:
     - port: 80
       targetPort: 80
     type: LoadBalancer
   ```

## 4. Cloud Platform Deployment

### AWS Deployment

1. **Setup Infrastructure**
   - EC2 instances or ECS/EKS
   - MongoDB Atlas or DocumentDB
   - ElastiCache for Redis
   - S3 for file storage
   - CloudFront for CDN
   - Route 53 for DNS

2. **CI/CD Pipeline**
   ```yaml
   # .github/workflows/aws.yml
   name: Deploy to AWS
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         
         - name: Configure AWS credentials
           uses: aws-actions/configure-aws-credentials@v1
           with:
             aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
             aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
             aws-region: us-east-1
         
         - name: Build and push Docker images
           run: |
             docker build -t travelshield-backend ./backend
             docker build -t travelshield-frontend ./frontend
             docker push ${{ secrets.ECR_REGISTRY }}/travelshield-backend
             docker push ${{ secrets.ECR_REGISTRY }}/travelshield-frontend
         
         - name: Deploy to ECS
           run: |
             aws ecs update-service --cluster travelshield --service backend --force-new-deployment
             aws ecs update-service --cluster travelshield --service frontend --force-new-deployment
   ```

## Monitoring and Maintenance

### 1. Monitoring Setup

- Prometheus for metrics
- Grafana for visualization
- ELK Stack for logs
- Uptime monitoring
- Error tracking (Sentry)

### 2. Backup Strategy

```bash
# MongoDB backup
mongodump --uri="$MONGODB_URI" --out=/backup/mongo/$(date +%Y%m%d)

# Redis backup
redis-cli save

# Application logs
rsync -av /var/log/travelshield/ /backup/logs/
```

### 3. Scaling Considerations

- Use load balancers
- Implement auto-scaling
- Cache frequently accessed data
- Optimize database queries
- Use CDN for static assets

## Security Considerations

1. **SSL/TLS Setup**
   ```bash
   # Install Certbot
   sudo apt-get install certbot python3-certbot-nginx

   # Get SSL certificate
   sudo certbot --nginx -d your-domain.com
   ```

2. **Firewall Configuration**
   ```bash
   # UFW setup
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow 22/tcp
   sudo ufw enable
   ```

3. **Security Headers**
   ```nginx
   # Nginx security headers
   add_header X-Frame-Options "SAMEORIGIN";
   add_header X-XSS-Protection "1; mode=block";
   add_header X-Content-Type-Options "nosniff";
   add_header Strict-Transport-Security "max-age=31536000";
   ```

## Troubleshooting

### Common Issues

1. **Connection Issues**
   - Check network connectivity
   - Verify firewall rules
   - Check DNS configuration
   - Validate SSL certificates

2. **Performance Issues**
   - Monitor resource usage
   - Check application logs
   - Analyze database performance
   - Review caching strategy

3. **Deployment Failures**
   - Check deployment logs
   - Verify environment variables
   - Validate configurations
   - Check resource availability

## Support

- Technical Support: support@travelshield.com
- Documentation: docs.travelshield.com
- Community Forum: community.travelshield.com
- Emergency Contact: emergency@travelshield.com
