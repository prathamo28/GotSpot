# GitHub Secrets Setup Guide

## Required Secrets

To deploy your frontend to GCP, you need to set up the following secrets in your GitHub repository:

### 1. GCP Service Account Key

1. **Create a Service Account:**
   ```bash
   gcloud iam service-accounts create gotspot-github-actions \
     --display-name="GotSpot GitHub Actions" \
     --description="Service account for GitHub Actions deployment"
   ```

2. **Grant Required Permissions:**
   ```bash
   # Storage permissions
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:gotspot-github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/storage.admin"

   # Compute permissions
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:gotspot-github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/compute.admin"

   # Cloud Build permissions
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:gotspot-github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/cloudbuild.builds.editor"

   # Terraform state permissions
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:gotspot-github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/storage.objectAdmin"
   ```

3. **Create and Download Key:**
   ```bash
   gcloud iam service-accounts keys create gotspot-sa-key.json \
     --iam-account=gotspot-github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com
   ```

4. **Add to GitHub Secrets:**
   - Go to your GitHub repository
   - Click Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `GCP_SA_KEY`
   - Value: Copy the entire content of `gotspot-sa-key.json`

### 2. GCP Project ID

1. **Add to GitHub Secrets:**
   - Name: `GCP_PROJECT_ID`
   - Value: Your GCP project ID (e.g., `gotspot-pilot-project`)

## How to Add Secrets

1. Go to your GitHub repository
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret with the name and value above

## Verification

After adding the secrets, you can verify they're working by:

1. Pushing to the `dev` branch
2. Checking the GitHub Actions tab
3. The workflow should run automatically

## Security Notes

- Never commit the service account key to your repository
- Rotate the service account key regularly
- Use least privilege principle for permissions
- Monitor the service account usage in GCP Console
