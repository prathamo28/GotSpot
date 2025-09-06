# GCP Setup Guide for GotSpot

## Quick Setup (Recommended)

### Option 1: Run the Setup Script
```bash
# For Windows Command Prompt
setup-gcp-secrets.bat

# For PowerShell
.\setup-gcp-secrets.ps1
```

### Option 2: Manual Setup

## Step 1: Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `gotspot-pilot-project`
3. Go to **IAM & Admin** → **Service Accounts**
4. Click **Create Service Account**
5. Fill in:
   - **Name**: `gotspot-github-actions`
   - **Description**: `Service account for GitHub Actions CI/CD`
6. Click **Create and Continue**

## Step 2: Grant Permissions

Add these roles to the service account:
- **Editor** (for general GCP access)
- **Firestore User** (for database access)
- **Storage Object Viewer** (for file access)
- **Maps Places API User** (for Google Maps API)

## Step 3: Create Service Account Key

1. Click on the service account you just created
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Choose **JSON** format
5. Click **Create**
6. Download the JSON file

## Step 4: Add Secrets to GitHub

1. Go to your GitHub repository: https://github.com/prathamo28/GotSpot
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

Add these secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `GCP_SA_KEY` | Contents of the JSON file from Step 3 | Service account credentials |
| `JWT_SECRET` | `gotspot-jwt-secret-12345-67890-abcdef` | JWT secret for authentication |
| `GOOGLE_MAPS_API_KEY` | Your Google Maps API key | Google Maps API access |

## Step 5: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `gotspot-pilot-project`
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **API Key**
5. Copy the API key
6. Add it to GitHub Secrets as `GOOGLE_MAPS_API_KEY`

## Step 6: Enable Required APIs

Make sure these APIs are enabled in your project:
- Cloud Run API
- Firestore API
- Cloud Storage API
- Maps JavaScript API
- Places API
- Geocoding API

## Troubleshooting

### Common Issues:

1. **"Service account already exists"**
   - This is normal, just continue with the next steps

2. **"Permission denied"**
   - Make sure you're logged in with an account that has Owner/Editor permissions
   - Run: `gcloud auth login`

3. **"Project not found"**
   - Make sure you're using the correct project ID: `gotspot-pilot-project`
   - Run: `gcloud config set project gotspot-pilot-project`

### Verify Setup:

```bash
# Check if you're logged in
gcloud auth list

# Check current project
gcloud config get-value project

# Test service account
gcloud iam service-accounts list --filter="displayName:gotspot-github-actions"
```

## Next Steps

Once you've completed the setup:
1. Push your changes to trigger the GitHub Actions workflow
2. Monitor the deployment at: https://github.com/prathamo28/GotSpot/actions
3. Check the logs if there are any errors

## Support

If you encounter any issues:
1. Check the GitHub Actions logs
2. Verify all secrets are correctly set
3. Ensure the service account has the required permissions
4. Make sure all required APIs are enabled
