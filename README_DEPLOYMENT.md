# 🚀 GotSpot Frontend Deployment

## Quick Start

### 1. One-Click Deployment
```bash
# Windows
deploy-frontend.bat your-gcp-project-id

# Linux/Mac
chmod +x scripts/setup-terraform-backend.sh
./scripts/setup-terraform-backend.sh your-gcp-project-id
```

### 2. Manual Setup
```bash
# 1. Setup Terraform backend
scripts\setup-terraform-backend.bat your-gcp-project-id

# 2. Edit terraform/terraform.tfvars
# 3. Initialize Terraform
cd terraform
terraform init
terraform plan
terraform apply

# 4. Setup GitHub secrets (see GITHUB_SECRETS_SETUP.md)
# 5. Push to dev branch
git push origin dev
```

## 📁 Project Structure

```
GotSpot/
├── terraform/                 # Infrastructure as Code
│   ├── main.tf               # Main Terraform configuration
│   ├── variables.tf          # Input variables
│   ├── outputs.tf            # Output values
│   └── terraform.tfvars.example # Example variables
├── .github/workflows/        # GitHub Actions
│   └── deploy-frontend.yml   # Deployment workflow
├── scripts/                  # Setup scripts
│   ├── setup-terraform-backend.bat # Windows setup
│   └── setup-terraform-backend.sh  # Linux/Mac setup
├── cloudbuild.yaml           # Cloud Build configuration
├── deploy-frontend.bat       # Quick deployment script
└── docs/                     # Documentation
    ├── GITHUB_SECRETS_SETUP.md
    └── DEPLOYMENT_GUIDE.md
```

## 🔧 What Gets Deployed

### GCP Resources
- **Cloud Storage Bucket** - Hosts your React app
- **Cloud CDN** - Global content delivery
- **Load Balancer** - Routes traffic
- **SSL Certificate** - HTTPS encryption
- **Global IP** - Public endpoint

### GitHub Actions
- **Terraform Plan** - Validates changes
- **Infrastructure Deploy** - Creates GCP resources
- **Frontend Deploy** - Builds and uploads React app
- **CDN Cache Invalidation** - Updates content

## 🌐 Access Your App

After deployment, you'll get:
- **Frontend URL**: `https://YOUR_IP_ADDRESS`
- **Storage URL**: `https://storage.googleapis.com/BUCKET_NAME`
- **Custom Domain**: (if configured)

## 📊 Monitoring

- **GitHub Actions**: Repository → Actions tab
- **GCP Console**: Cloud Console → Your project
- **CDN Logs**: Network Services → Cloud CDN
- **Terraform State**: Cloud Storage → gotspot-terraform-state

## 🔒 Security

- ✅ **HTTPS only** (automatic)
- ✅ **CORS configured** for web access
- ✅ **Service account** with minimal permissions
- ✅ **State encryption** in Cloud Storage
- ✅ **CDN security** headers

## 💰 Cost

- **Storage**: ~$0.02/GB/month
- **CDN**: ~$0.08/GB egress
- **Load Balancer**: ~$0.01/hour
- **Total**: ~$5-20/month for small app

## 🚨 Troubleshooting

### Common Issues
1. **Permission denied** → Check service account permissions
2. **SSL not ready** → Wait 10-15 minutes
3. **CDN cache** → Invalidate cache manually
4. **Terraform state locked** → Use `terraform force-unlock`

### Getting Help
1. Check GitHub Actions logs
2. Review GCP Console
3. Check Terraform state: `terraform show`

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Detailed setup instructions
- [GitHub Secrets Setup](GITHUB_SECRETS_SETUP.md) - Configure secrets
- [Terraform Documentation](https://terraform.io/docs) - Learn Terraform

## 🎯 Next Steps

1. **Deploy infrastructure** using the scripts above
2. **Configure GitHub secrets** for automated deployment
3. **Push to dev branch** to trigger frontend deployment
4. **Test your app** at the provided URL
5. **Configure custom domain** (optional)

---

**Need help?** Check the troubleshooting section or review the detailed documentation!
