# 🔐 GitHub Secrets Setup Guide

## Required Secrets for GotSpot Deployment

You need to add these secrets to your GitHub repository:

### 1. **GCP_SA_KEY** (Google Cloud Service Account Key)

#### Step 1: Create Service Account
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

#### Step 2: Add to GitHub Secrets
1. Go to your repository: `https://github.com/prathamo28/GotSpot`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `GCP_SA_KEY`
5. Value: Copy the entire contents of `gotspot-sa-key.json` file
6. Click **Add secret**

### 2. **GOOGLE_MAPS_API_KEY** (Google Maps API Key)

#### Step 1: Get API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `gotspot-pilot-project`
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **API Key**
5. Copy the API key

#### Step 2: Add to GitHub Secrets
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `GOOGLE_MAPS_API_KEY`
4. Value: Your Google Maps API key
5. Click **Add secret**

### 3. **JWT_SECRET** (JWT Secret for Authentication)

#### Step 1: Generate Secret
```bash
# Generate a random secret (run this locally)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Step 2: Add to GitHub Secrets
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `JWT_SECRET`
4. Value: The generated secret from Step 1
5. Click **Add secret**

### 4. **SNYK_TOKEN** (Optional - for security scanning)

#### Step 1: Get Snyk Token
1. Go to [Snyk.io](https://snyk.io/)
2. Sign up/Login
3. Go to **Account Settings** → **General**
4. Copy your API token

#### Step 2: Add to GitHub Secrets
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `SNYK_TOKEN`
4. Value: Your Snyk API token
5. Click **Add secret**

## 🔧 Quick Setup Commands

### Create Service Account (Run locally):
```bash
# Set project
gcloud config set project gotspot-pilot-project

# Create service account
gcloud iam service-accounts create gotspot-github-actions \
    --display-name="GotSpot GitHub Actions"

# Grant permissions
gcloud projects add-iam-policy-binding gotspot-pilot-project \
    --member="serviceAccount:gotspot-github-actions@gotspot-pilot-project.iam.gserviceaccount.com" \
    --role="roles/editor"

# Create key file
gcloud iam service-accounts keys create gotspot-sa-key.json \
    --iam-account=gotspot-github-actions@gotspot-pilot-project.iam.gserviceaccount.com

# Display the key (copy this to GitHub Secrets)
cat gotspot-sa-key.json
```

### Generate JWT Secret (Run locally):
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## ✅ Verification

After adding all secrets, your GitHub repository should have:
- ✅ `GCP_SA_KEY`
- ✅ `GOOGLE_MAPS_API_KEY`
- ✅ `JWT_SECRET`
- ✅ `SNYK_TOKEN` (optional)

## 🚀 Test Deployment

Once all secrets are added:
1. Go to **Actions** tab
2. Click **Re-run all jobs** on the latest workflow
3. The deployment should now work!

## 🔒 Security Notes

- **Never commit** the `gotspot-sa-key.json` file to your repository
- **Rotate secrets** regularly for security
- **Use least privilege** for service account permissions
- **Monitor usage** in Google Cloud Console
