# 🚀 GotSpot Deployment Guide

## 🎯 **Infrastructure as Code Approach**

This setup allows you to:
- ✅ **Deploy everything** with one command
- ✅ **Destroy everything** with one command  
- ✅ **Save costs** by shutting down when not needed
- ✅ **No local dependencies** required
- ✅ **Reproducible** deployments

## 📁 **Project Structure**

```
gotspot/
├── infrastructure/           # All infrastructure code
│   ├── terraform/           # Infrastructure as Code
│   ├── deploy.sh            # Deploy everything
│   ├── destroy.sh           # Destroy everything
│   └── setup.sh             # Quick setup
├── backend/                 # Node.js API
├── mobile-app/             # React Native app
└── docs/                   # Documentation
```

## 🚀 **Quick Start (3 Commands)**

### **1. Deploy Everything**
```bash
# Make scripts executable
chmod +x infrastructure/*.sh

# Deploy complete infrastructure
./infrastructure/deploy.sh
```

### **2. Test Your API**
```bash
# Get API URL from deployment output
curl https://your-api-url.a.run.app/health
```

### **3. Destroy Everything (Save Costs)**
```bash
# Destroy all resources
./infrastructure/destroy.sh
```

## 🔧 **Detailed Setup**

### **Step 1: Configure Environment**

1. **Copy configuration file:**
```bash
cp infrastructure/terraform/terraform.tfvars.example infrastructure/terraform/terraform.tfvars
```

2. **Edit terraform.tfvars:**
```hcl
project_id = "gotspot-pilot-project"
region = "europe-west1"
google_maps_api_key = "your-api-key-here"
jwt_secret = "your-secret-key-here"
```

### **Step 2: Deploy Infrastructure**

```bash
# Option 1: Using Terraform (Recommended)
./infrastructure/deploy.sh

# Option 2: Using gcloud directly
./infrastructure/setup.sh
```

### **Step 3: Verify Deployment**

```bash
# Check API health
curl https://your-api-url.a.run.app/health

# Check Firestore
gcloud firestore databases list

# Check Cloud Run
gcloud run services list
```

## 💰 **Cost Management**

### **Daily Development Workflow**

**Morning (Start Development):**
```bash
./infrastructure/deploy.sh
```

**Evening (Save Costs):**
```bash
./infrastructure/destroy.sh
```

### **Cost Breakdown**

| Resource | Cost When Running | Cost When Stopped |
|----------|------------------|-------------------|
| **Cloud Run** | $0.10/hour | $0.00 |
| **Firestore** | $0.00 | $0.00 (Free tier) |
| **Storage** | $0.02/month | $0.02/month |
| **Maps API** | Pay per use | $0.00 |
| **Total** | **~$2.50/day** | **~$0.02/month** |

### **Cost Optimization Tips**

1. **Stop when not developing:**
   ```bash
   ./infrastructure/destroy.sh
   ```

2. **Use free tiers effectively:**
   - Firestore: 50K reads/day free
   - Cloud Run: 2M requests/month free
   - Storage: 5GB free

3. **Monitor usage:**
   ```bash
   gcloud billing budgets list
   ```

## 🛠️ **Development Workflow**

### **Local Development (No Cloud Costs)**

1. **Run backend locally:**
```bash
cd backend
npm install
npm run dev
```

2. **Run mobile app:**
```bash
cd mobile-app
npm install
npm start
```

### **Testing with Real Cloud**

1. **Deploy to cloud:**
```bash
./infrastructure/deploy.sh
```

2. **Test with real APIs:**
```bash
# Test parking spots API
curl "https://your-api-url.a.run.app/api/parking/spots?lat=54.3520&lng=18.6466"
```

3. **Destroy when done:**
```bash
./infrastructure/destroy.sh
```

## 📱 **Mobile App Deployment**

### **Build for Production**

```bash
cd mobile-app

# Build for Android
expo build:android

# Build for iOS  
expo build:ios

# Or use EAS Build
eas build --platform all
```

### **Deploy to App Stores**

```bash
# Submit to stores
eas submit --platform all
```

## 🔍 **Monitoring & Debugging**

### **View Logs**

```bash
# Cloud Run logs
gcloud run services logs read gotspot-api --region=europe-west1

# Firestore logs
gcloud logging read "resource.type=firestore_database"
```

### **Monitor Costs**

```bash
# View billing
gcloud billing accounts list
gcloud billing budgets list

# View usage
gcloud logging read "resource.type=cloud_run_revision"
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **API not responding:**
   ```bash
   # Check service status
   gcloud run services describe gotspot-api --region=europe-west1
   ```

2. **Firestore not working:**
   ```bash
   # Check database
   gcloud firestore databases list
   ```

3. **Maps API not working:**
   ```bash
   # Check API key
   gcloud services api-keys list
   ```

### **Reset Everything**

```bash
# Nuclear option - destroy and recreate
./infrastructure/destroy.sh
./infrastructure/deploy.sh
```

## 📊 **Production Deployment**

### **For Production Use**

1. **Update terraform.tfvars:**
```hcl
environment = "prod"
# Add production API keys
# Add production secrets
```

2. **Deploy with production settings:**
```bash
./infrastructure/deploy.sh
```

3. **Set up monitoring:**
```bash
# Enable monitoring
gcloud services enable monitoring.googleapis.com
```

## 🎯 **Best Practices**

### **Development**
- Use local development for coding
- Deploy to cloud only for testing
- Destroy resources when not needed
- Monitor costs daily

### **Production**
- Use Terraform for infrastructure
- Set up monitoring and alerts
- Implement proper security
- Plan for scaling

## 💡 **Pro Tips**

1. **Save Money:**
   - Always destroy when not developing
   - Use free tiers effectively
   - Monitor usage regularly

2. **Save Time:**
   - Use the provided scripts
   - Keep infrastructure as code
   - Automate deployments

3. **Stay Organized:**
   - Use consistent naming
   - Document everything
   - Version control everything

---

## 🎉 **You're Ready!**

With this setup, you can:
- ✅ **Deploy everything** in 5 minutes
- ✅ **Destroy everything** in 2 minutes
- ✅ **Save 90% on costs** when not developing
- ✅ **Scale up/down** as needed
- ✅ **Reproduce** deployments anywhere

**Happy coding! 🚀**
