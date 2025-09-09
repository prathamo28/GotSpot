# GotSpot Frontend Deployment Guide

## Overview

This guide will help you deploy your GotSpot frontend to Google Cloud Platform using Terraform and GitHub Actions.

## Architecture

```
GitHub → GitHub Actions → Terraform → GCP Resources
                ↓
        State Backend (Cloud Storage)
                ↓
        Frontend (Cloud Storage + CDN)
```

## Prerequisites

1. **GCP Project** with billing enabled
2. **GitHub Repository** with your code
3. **gcloud CLI** installed and authenticated
4. **Terraform** installed (version 1.6.0+)

## Step 1: Setup GCP Project

1. **Create or select a GCP project:**
   ```bash
   gcloud projects create gotspot-pilot-project
   gcloud config set project gotspot-pilot-project
   ```

2. **Enable billing** for your project in the GCP Console

3. **Enable required APIs:**
   ```bash
   gcloud services enable storage.googleapis.com
   gcloud services enable compute.googleapis.com
   gcloud services enable cloudbuild.googleapis.com
   ```

## Step 2: Setup Terraform Backend

1. **Run the setup script:**
   ```bash
   # Windows
   scripts\setup-terraform-backend.bat gotspot-pilot-project
   
   # Linux/Mac
   chmod +x scripts/setup-terraform-backend.sh
   ./scripts/setup-terraform-backend.sh gotspot-pilot-project
   ```

2. **Edit terraform/terraform.tfvars:**
   ```hcl
   project_id = "gotspot-pilot-project"
   region     = "europe-west1"
   domain_name = "gotspot.com"
   github_owner = "your-github-username"
   github_repo  = "GotSpot"
   ```

## Step 3: Setup GitHub Secrets

Follow the instructions in `GITHUB_SECRETS_SETUP.md` to add:

- `GCP_SA_KEY`: Service account key JSON
- `GCP_PROJECT_ID`: Your GCP project ID

## Step 4: Deploy Infrastructure

1. **Initialize Terraform:**
   ```bash
   cd terraform
   terraform init
   ```

2. **Plan deployment:**
   ```bash
   terraform plan -var-file="terraform.tfvars"
   ```

3. **Apply infrastructure:**
   ```bash
   terraform apply -var-file="terraform.tfvars"
   ```

## Step 5: Deploy Frontend

1. **Push to dev branch:**
   ```bash
   git add .
   git commit -m "Add frontend deployment infrastructure"
   git push origin dev
   ```

2. **GitHub Actions will automatically:**
   - Build your React app
   - Deploy to Cloud Storage
   - Configure CDN
   - Set up HTTPS

## Step 6: Verify Deployment

1. **Check GitHub Actions:**
   - Go to your repository's Actions tab
   - Verify the deployment workflow completed successfully

2. **Test your frontend:**
   - Get the frontend URL from Terraform outputs
   - Visit the URL in your browser
   - Test the login functionality

## Step 7: Configure Custom Domain (Optional)

1. **Update DNS records:**
   - Add an A record pointing to the IP address from Terraform outputs
   - Wait for DNS propagation (up to 24 hours)

2. **Update Terraform variables:**
   ```hcl
   domain_name = "your-domain.com"
   ```

3. **Reapply Terraform:**
   ```bash
   terraform apply -var-file="terraform.tfvars"
   ```

## Monitoring and Maintenance

### View Logs
- **GitHub Actions:** Repository → Actions tab
- **GCP Logs:** Cloud Console → Logging
- **CDN Logs:** Cloud Console → Network Services → Cloud CDN

### Update Frontend
1. Make changes to your code
2. Push to `dev` branch
3. GitHub Actions will automatically redeploy

### Update Infrastructure
1. Modify Terraform files
2. Run `terraform plan` to preview changes
3. Run `terraform apply` to apply changes

## Troubleshooting

### Common Issues

1. **Terraform state locked:**
   ```bash
   terraform force-unlock LOCK_ID
   ```

2. **Permission denied:**
   - Check service account permissions
   - Verify GitHub secrets are correct

3. **SSL certificate not ready:**
   - Wait 10-15 minutes for certificate provisioning
   - Check certificate status in GCP Console

4. **CDN cache issues:**
   ```bash
   gcloud compute url-maps invalidate-cdn-cache URL_MAP_NAME --path="/*"
   ```

### Getting Help

1. Check GitHub Actions logs
2. Check GCP Console for resource status
3. Review Terraform state: `terraform show`

## Cost Optimization

- **Storage:** ~$0.02/GB/month
- **CDN:** ~$0.08/GB egress
- **Compute:** ~$0.01/hour for load balancer
- **Total:** ~$5-20/month for small app

## Security Best Practices

1. **Rotate service account keys** regularly
2. **Use least privilege** for permissions
3. **Enable audit logging** in GCP
4. **Monitor resource usage** and costs
5. **Keep Terraform state** secure and backed up
