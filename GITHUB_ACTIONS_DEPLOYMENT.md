# 🚀 GitHub Actions + Terraform Deployment

Complete CI/CD pipeline for GotSpot using GitHub Actions and Terraform for infrastructure management.

## 🎯 **Why GitHub Actions + Terraform?**

- ✅ **Runs in the cloud** - No local resource usage
- ✅ **Consistent environment** - Same setup every time
- ✅ **Automatic triggers** - Deploy on push/PR
- ✅ **Secure secrets** - API keys stored securely
- ✅ **Better logging** - Detailed deployment logs
- ✅ **Infrastructure as Code** - Version controlled infrastructure

## 📋 **Prerequisites**

### **GitHub Secrets Required**
Set these in your GitHub repository settings:

1. **`GCP_SA_KEY`** - Google Cloud Service Account JSON key
2. **`GOOGLE_MAPS_API_KEY`** - Google Maps API key
3. **`JWT_SECRET`** - JWT secret for authentication
4. **`SNYK_TOKEN`** - Snyk security scanning token (optional)

### **Service Account Setup**
```bash
# Create service account
gcloud iam service-accounts create gotspot-github-actions \
    --display-name="GotSpot GitHub Actions" \
    --description="Service account for GitHub Actions deployment"

# Grant necessary permissions
gcloud projects add-iam-policy-binding gotspot-pilot-project \
    --member="serviceAccount:gotspot-github-actions@gotspot-pilot-project.iam.gserviceaccount.com" \
    --role="roles/editor"

# Create and download key
gcloud iam service-accounts keys create gotspot-sa-key.json \
    --iam-account=gotspot-github-actions@gotspot-pilot-project.iam.gserviceaccount.com
```

## 🔄 **Workflow Overview**

### **1. Development Branch (`dev`)**
- **Trigger**: Push to `dev` branch
- **Actions**:
  - Security scan
  - Build and test
  - Deploy infrastructure (Terraform)
  - Deploy backend API
  - Run smoke tests

### **2. UAT Branch (`uat`)**
- **Trigger**: Push to `uat` branch
- **Actions**:
  - Comprehensive security scan
  - Infrastructure security scan
  - Build and test
  - Deploy infrastructure
  - Deploy backend API
  - Run UAT tests

### **3. Pre-Prod Branch (`pre-prod`)**
- **Trigger**: Push to `pre-prod` branch
- **Actions**:
  - Production-level security scan
  - Performance tests
  - Deploy infrastructure
  - Deploy backend API
  - Run integration tests

### **4. Production Branch (`main`)**
- **Trigger**: Push to `main` branch
- **Actions**:
  - Critical security scan
  - Deploy infrastructure
  - Deploy backend API
  - Run production tests

### **5. Manual Deploy**
- **Trigger**: Manual workflow dispatch
- **Options**:
  - Environment: dev, uat, pre-prod, production
  - Action: deploy, destroy, plan

## 🚀 **How to Deploy**

### **Option 1: Automatic Deployment**
```bash
# Push to dev branch
git add .
git commit -m "Deploy to development"
git push origin dev
```

### **Option 2: Manual Deployment**
1. Go to GitHub Actions tab
2. Select "Manual Deploy" workflow
3. Click "Run workflow"
4. Choose environment and action
5. Click "Run workflow"

### **Option 3: Local Scripts**
```bash
# Deploy everything
deploy-all.bat

# Delete everything
delete-all.bat

# Check status
check-status.bat
```

## 🏗️ **Infrastructure Components**

### **Terraform Resources**
- **Firestore Database** - NoSQL database
- **Cloud Storage** - File storage
- **Cloud Run** - Backend API
- **Service Accounts** - Authentication
- **IAM Policies** - Permissions
- **API Enablement** - Required Google APIs

### **Environment-Specific Configs**
- `environments/dev.tfvars` - Development settings
- `environments/uat.tfvars` - UAT settings
- `environments/pre-prod.tfvars` - Pre-production settings
- `environments/production.tfvars` - Production settings

## 📊 **Monitoring & Logs**

### **GitHub Actions Logs**
- Go to Actions tab in GitHub
- Click on specific workflow run
- View detailed logs for each step

### **Google Cloud Logs**
- Cloud Run logs: `gcloud run services logs gotspot-api-dev`
- Firestore logs: Google Cloud Console
- Storage logs: Google Cloud Console

### **Cost Monitoring**
- Use `check-costs.bat` for local cost checking
- Google Cloud Console billing section
- Set up billing alerts

## 🔧 **Troubleshooting**

### **Common Issues**

#### **1. Terraform Init Fails**
```bash
# Check service account permissions
gcloud auth list
gcloud config get-value project
```

#### **2. Cloud Run Deploy Fails**
```bash
# Check if APIs are enabled
gcloud services list --enabled
```

#### **3. Secrets Not Found**
- Verify secrets are set in GitHub repository settings
- Check secret names match workflow files

#### **4. Build Fails**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript compilation errors

### **Debug Commands**
```bash
# Check GitHub Actions status
gh run list

# Check Cloud Run services
gcloud run services list

# Check Terraform state
cd infrastructure/terraform
terraform show
```

## 💰 **Cost Management**

### **Estimated Costs (5 users)**
- **Cloud Run**: $0-5/month (pay-per-use)
- **Firestore**: $0-2/month (minimal data)
- **Storage**: $0-1/month (small files)
- **Maps API**: $0-10/month (limited usage)
- **Total**: $0-18/month

### **Cost Optimization**
- ✅ Auto-scaling to zero when not used
- ✅ 30-day storage lifecycle
- ✅ Efficient API usage patterns
- ✅ One-click deletion for testing

## 🔐 **Security Features**

### **Security Scanning**
- **NPM Audit** - Dependency vulnerabilities
- **Snyk** - Advanced security scanning
- **CodeQL** - Code analysis
- **OWASP** - Dependency check
- **Trivy** - Container scanning
- **Checkov** - Infrastructure security
- **TFSec** - Terraform security

### **Secrets Management**
- All sensitive data stored in GitHub Secrets
- Service account keys rotated regularly
- Environment-specific configurations

## 📱 **Mobile App Deployment**

### **Expo Build**
- Automatic builds on GitHub Actions
- Android APK generation
- iOS Archive generation
- Build artifacts stored as GitHub Actions artifacts

### **Local Development**
```bash
cd mobile-app
npm install
npx expo start
```

## 🎉 **Quick Start**

1. **Set up GitHub Secrets**
2. **Push to dev branch**
3. **Monitor GitHub Actions**
4. **Access your deployed app**

**That's it! Your complete GotSpot infrastructure is deployed! 🚀**

---

## 📞 **Support**

- **GitHub Issues**: Create issue in repository
- **GitHub Actions**: Check workflow logs
- **Google Cloud**: Check Cloud Console logs
- **Documentation**: Check individual component READMEs
