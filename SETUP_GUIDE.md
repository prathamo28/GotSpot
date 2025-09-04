# 🚀 GotSpot Enterprise Setup Guide

## 🎯 **Complete CI/CD Pipeline with Security Scanning**

This guide will help you set up a professional, enterprise-grade CI/CD pipeline with comprehensive security scanning and automated deployments.

## 📋 **What You'll Get**

- ✅ **4-tier branch strategy** (dev → uat → pre-prod → main)
- ✅ **Comprehensive security scanning** at each level
- ✅ **Automated deployments** to different environments
- ✅ **Cost optimization** with environment management
- ✅ **Security reports** and vulnerability tracking
- ✅ **Performance testing** and monitoring

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │───▶│      UAT        │───▶│   Pre-Production│───▶│   Production    │
│     (dev)       │    │     (uat)       │    │   (pre-prod)    │    │     (main)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │                       │
         ▼                       ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Basic Security  │    │ Comprehensive   │    │ Production      │    │ Critical        │
│ Scans           │    │ Security Scans  │    │ Security Scans  │    │ Security Scans  │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 **Quick Start (5 Minutes)**

### **Step 1: Set Up Branches**
```bash
# Windows
scripts\setup-branches.bat

# Linux/Mac
chmod +x scripts/setup-branches.sh
./scripts/setup-branches.sh
```

### **Step 2: Configure GitHub Secrets**
Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
- `GCP_SA_KEY`: Your Google Cloud service account key
- `SNYK_TOKEN`: Your Snyk security token
- `SONAR_TOKEN`: Your SonarCloud token
- `GOOGLE_MAPS_API_KEY`: Your Google Maps API key
- `JWT_SECRET`: Your JWT signing secret

### **Step 3: Deploy Development Environment**
```bash
# Deploy to development
infrastructure\deploy.bat
```

### **Step 4: Start Developing**
```bash
# Create feature branch
git checkout -b feature/my-new-feature

# Make changes and push
git add .
git commit -m "Add new feature"
git push origin feature/my-new-feature

# Merge to dev for testing
git checkout dev
git merge feature/my-new-feature
git push origin dev
```

## 🔧 **Detailed Setup**

### **1. Branch Structure Setup**

The branch structure follows a strict hierarchy:

```
main (production)
├── pre-prod (staging)
├── uat (user acceptance testing)
└── dev (development)
```

**Branch Protection Rules:**
- **main**: Requires 2 approvals, blocks force pushes
- **pre-prod**: Requires 1 approval, blocks force pushes
- **uat**: Requires 1 approval, allows force pushes
- **dev**: No restrictions, allows force pushes

### **2. Security Scanning Configuration**

#### **Development (dev)**
- **NPM Audit**: Moderate level vulnerabilities
- **Snyk Scan**: High severity vulnerabilities
- **CodeQL**: Code analysis
- **Basic dependency check**

#### **UAT (uat)**
- **NPM Audit**: High level vulnerabilities
- **Snyk Scan**: Medium severity vulnerabilities
- **CodeQL**: Code analysis
- **OWASP Dependency Check**
- **Trivy vulnerability scanner**
- **Infrastructure security scan** (Checkov, TFSec)

#### **Pre-Production (pre-prod)**
- **NPM Audit**: Critical level vulnerabilities
- **Snyk Scan**: Low severity vulnerabilities
- **CodeQL**: Code analysis
- **OWASP Dependency Check**
- **Trivy vulnerability scanner**
- **SonarCloud scan**
- **Infrastructure security scan**
- **Performance testing**

#### **Production (main)**
- **NPM Audit**: Critical level vulnerabilities
- **Snyk Scan**: Low severity vulnerabilities
- **CodeQL**: Code analysis
- **OWASP Dependency Check**
- **Trivy vulnerability scanner**
- **SonarCloud scan**
- **Infrastructure security scan**
- **Performance testing**

### **3. Environment Configuration**

#### **Development Environment**
- **URL**: `https://gotspot-api-dev-{region}-{project}.a.run.app`
- **Resources**: 512Mi RAM, 1 CPU, 0-5 instances
- **Cost**: ~$0.50/day when running
- **Purpose**: Feature development and testing

#### **UAT Environment**
- **URL**: `https://gotspot-api-uat-{region}-{project}.a.run.app`
- **Resources**: 1Gi RAM, 2 CPU, 1-10 instances
- **Cost**: ~$2.00/day when running
- **Purpose**: User acceptance testing

#### **Pre-Production Environment**
- **URL**: `https://gotspot-api-preprod-{region}-{project}.a.run.app`
- **Resources**: 2Gi RAM, 2 CPU, 2-20 instances
- **Cost**: ~$5.00/day when running
- **Purpose**: Production-like testing

#### **Production Environment**
- **URL**: `https://gotspot-api-{region}-{project}.a.run.app`
- **Resources**: 4Gi RAM, 4 CPU, 5-100 instances
- **Cost**: ~$20.00/day when running
- **Purpose**: Live production traffic

### **4. Security Tools Setup**

#### **Snyk Security Scanning**
1. Sign up at [snyk.io](https://snyk.io)
2. Get your API token
3. Add `SNYK_TOKEN` to GitHub secrets

#### **SonarCloud Code Quality**
1. Sign up at [sonarcloud.io](https://sonarcloud.io)
2. Connect your GitHub repository
3. Get your token
4. Add `SONAR_TOKEN` to GitHub secrets

#### **OWASP Dependency Check**
- Automatically configured in CI/CD pipeline
- No additional setup required

#### **Trivy Vulnerability Scanner**
- Automatically configured in CI/CD pipeline
- No additional setup required

### **5. Monitoring and Alerts**

#### **Security Monitoring**
- **Vulnerability alerts**: Real-time notifications
- **Security scan results**: After each pipeline run
- **Compliance reports**: Weekly summaries

#### **Performance Monitoring**
- **Response times**: Real-time monitoring
- **Error rates**: Real-time monitoring
- **Resource usage**: Real-time monitoring

#### **Cost Monitoring**
- **Daily costs**: Daily reports
- **Budget alerts**: When exceeded
- **Optimization suggestions**: Weekly

## 🔄 **Development Workflow**

### **1. Feature Development**
```bash
# Create feature branch from dev
git checkout dev
git pull origin dev
git checkout -b feature/my-new-feature

# Develop and test locally
npm run dev
npm test

# Commit and push
git add .
git commit -m "Add new feature"
git push origin feature/my-new-feature

# Create pull request to dev
# (This will trigger security scans)
```

### **2. Development Testing**
```bash
# Merge feature to dev
git checkout dev
git merge feature/my-new-feature
git push origin dev

# This triggers:
# - Security scans
# - Unit tests
# - Integration tests
# - Deployment to dev environment
```

### **3. UAT Testing**
```bash
# Merge dev to uat
git checkout uat
git merge dev
git push origin uat

# This triggers:
# - Comprehensive security scans
# - Full test suite
# - Deployment to UAT environment
```

### **4. Pre-Production Testing**
```bash
# Merge uat to pre-prod
git checkout pre-prod
git merge uat
git push origin pre-prod

# This triggers:
# - Production-level security scans
# - Performance tests
# - E2E tests
# - Deployment to pre-production environment
```

### **5. Production Deployment**
```bash
# Merge pre-prod to main
git checkout main
git merge pre-prod
git push origin main

# This triggers:
# - Critical security scans
# - Production tests
# - Deployment to production environment
```

## 🛡️ **Security Best Practices**

### **Daily Security Checks**
1. **Review security reports** in GitHub Actions
2. **Fix critical vulnerabilities** immediately
3. **Update dependencies** regularly
4. **Monitor for new vulnerabilities**

### **Weekly Security Reviews**
1. **Review Snyk dashboard** for new vulnerabilities
2. **Check SonarCloud** for code quality issues
3. **Review infrastructure security** reports
4. **Update security policies** if needed

### **Monthly Security Audits**
1. **Comprehensive security review**
2. **Penetration testing** (if needed)
3. **Security policy updates**
4. **Team security training**

## 💰 **Cost Management**

### **Daily Cost Optimization**
```bash
# Stop development environment when not needed
infrastructure\destroy.bat

# Start development environment when needed
infrastructure\deploy.bat
```

### **Environment Costs (Daily)**
- **Development**: $0.50 (when running)
- **UAT**: $2.00 (when running)
- **Pre-Production**: $5.00 (when running)
- **Production**: $20.00 (always running)

### **Cost Optimization Tips**
1. **Stop environments** when not needed
2. **Use free tiers** effectively
3. **Monitor usage** regularly
4. **Set budget alerts**

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Security Scan Failures**
```bash
# Check security reports
# Fix vulnerabilities
# Re-run pipeline
```

#### **Deployment Failures**
```bash
# Check logs in GitHub Actions
# Verify environment variables
# Check Google Cloud permissions
```

#### **Test Failures**
```bash
# Check test logs
# Fix failing tests
# Re-run pipeline
```

### **Getting Help**
1. **Check GitHub Actions logs**
2. **Review security reports**
3. **Check Google Cloud console**
4. **Contact support if needed**

## 📊 **Monitoring Dashboard**

### **GitHub Actions**
- **Security scans**: Real-time results
- **Test results**: Pass/fail status
- **Deployment status**: Success/failure

### **Google Cloud Console**
- **Service health**: Real-time monitoring
- **Resource usage**: CPU, memory, requests
- **Error rates**: 4xx, 5xx errors

### **Security Dashboards**
- **Snyk**: Vulnerability tracking
- **SonarCloud**: Code quality metrics
- **GitHub Security**: Security alerts

## 🎯 **Next Steps**

### **Immediate Actions**
1. **Set up GitHub secrets**
2. **Run branch setup script**
3. **Deploy development environment**
4. **Start developing**

### **Short-term Goals**
1. **Implement first feature**
2. **Test security pipeline**
3. **Optimize costs**
4. **Monitor performance**

### **Long-term Goals**
1. **Scale to production**
2. **Add more security tools**
3. **Implement advanced monitoring**
4. **Team training**

## 🎉 **You're Ready!**

Your enterprise-grade CI/CD pipeline is now set up with:
- ✅ **Professional branch strategy**
- ✅ **Comprehensive security scanning**
- ✅ **Automated deployments**
- ✅ **Cost optimization**
- ✅ **Monitoring and alerts**

**Start developing and let the pipeline handle the rest! 🚀**
