# 🚀 GotSpot - One-Click GCP Deployment

Complete infrastructure deployment and management system for GotSpot on Google Cloud Platform.

## 📋 Prerequisites

1. **Google Cloud CLI** installed and configured
2. **Terraform** installed (optional - included in scripts)
3. **Node.js 18+** for local development
4. **Vercel CLI** for frontend deployment (`npm install -g vercel`)

## 🎯 One-Click Commands

### 🚀 Deploy Everything
```bash
deploy-all.bat
```
**What it does:**
- ✅ Enables all required GCP APIs
- ✅ Creates Firestore database
- ✅ Sets up Cloud Storage bucket
- ✅ Deploys backend API to Cloud Run
- ✅ Deploys frontend to Vercel
- ✅ Builds mobile app (Android/iOS)

### 🗑️ Delete Everything
```bash
delete-all.bat
```
**What it does:**
- ✅ Destroys all Terraform resources
- ✅ Deletes Cloud Run services
- ✅ Removes Firestore database
- ✅ Deletes Cloud Storage buckets
- ✅ Cleans up service accounts
- ✅ Stops all costs immediately

### 📊 Check Status
```bash
check-status.bat
```
**What it shows:**
- ✅ Infrastructure deployment status
- ✅ Cloud Run services status
- ✅ Database and storage status
- ✅ Service account permissions
- ✅ API usage and billing

### 💰 Check Costs
```bash
check-costs.bat
```
**What it shows:**
- ✅ Current daily/monthly costs
- ✅ Resource usage breakdown
- ✅ Cost optimization suggestions

## 🏗️ Infrastructure Components

### **Backend API (Cloud Run)**
- **Service**: `gotspot-api`
- **Runtime**: Node.js 18
- **Memory**: 1GB
- **CPU**: 1 vCPU
- **Scaling**: 0-10 instances
- **URL**: `https://gotspot-api-xxxxx-ew.a.run.app`

### **Database (Firestore)**
- **Type**: Firestore Native
- **Location**: Europe West 1
- **Collections**: `parking_spots`, `users`, `analytics`

### **Storage (Cloud Storage)**
- **Bucket**: `gotspot-pilot-project-gotspot-storage`
- **Purpose**: Static files, images, backups
- **Lifecycle**: 30-day auto-deletion

### **Frontend (Vercel)**
- **URL**: `https://gotspot.vercel.app`
- **Framework**: React + TypeScript
- **Build**: Automatic on git push

### **Mobile App (Expo)**
- **Platform**: React Native + Expo
- **Build**: Android APK + iOS Archive
- **Location**: `mobile-app/build/`

## 🔧 Configuration

### **Environment Variables**
All sensitive data is stored in `infrastructure/terraform/terraform.tfvars`:
```hcl
project_id = "gotspot-pilot-project"
region = "europe-west1"
google_maps_api_key = "your-api-key"
jwt_secret = "your-jwt-secret"
```

### **API Keys Required**
1. **Google Maps API Key** - For parking spot data
2. **Vercel Account** - For frontend deployment
3. **Expo Account** - For mobile app builds

## 💰 Cost Management

### **Estimated Monthly Costs (5 users)**
- **Cloud Run**: $0-5 (pay-per-use)
- **Firestore**: $0-2 (minimal data)
- **Storage**: $0-1 (small files)
- **Maps API**: $0-10 (limited usage)
- **Total**: $0-18/month

### **Cost Optimization**
- ✅ Auto-scaling to zero when not used
- ✅ 30-day storage lifecycle
- ✅ Efficient API usage patterns
- ✅ One-click deletion for testing

## 🚨 Troubleshooting

### **Deployment Fails**
1. Check Google Cloud CLI: `gcloud auth list`
2. Verify project: `gcloud config get-value project`
3. Check billing: `gcloud billing accounts list`

### **Backend Not Working**
1. Check Cloud Run logs: `gcloud run services logs gotspot-api`
2. Verify environment variables
3. Test API endpoints manually

### **Frontend Not Loading**
1. Check Vercel deployment status
2. Verify environment variables
3. Check browser console for errors

## 📱 Mobile App Development

### **Local Development**
```bash
cd mobile-app
npm install
npx expo start
```

### **Build for Production**
```bash
npx expo build:android
npx expo build:ios
```

## 🔄 Development Workflow

1. **Make changes** to code
2. **Test locally** (optional)
3. **Run `deploy-all.bat`** to deploy
4. **Test in cloud** environment
5. **Run `delete-all.bat`** when done

## 📞 Support

- **Documentation**: Check individual component READMEs
- **Issues**: Check Google Cloud Console logs
- **Costs**: Use `check-costs.bat` regularly

---

## 🎉 Quick Start

1. **Clone repository**
2. **Install prerequisites**
3. **Configure `terraform.tfvars`**
4. **Run `deploy-all.bat`**
5. **Access your app!**

**That's it! Your complete GotSpot infrastructure is ready! 🚀**
