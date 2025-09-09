@echo off
REM Setup Terraform backend for state management
REM This script creates the GCS bucket for storing Terraform state

set PROJECT_ID=%1
if "%PROJECT_ID%"=="" set PROJECT_ID=your-gcp-project-id
set BUCKET_NAME=gotspot-terraform-state
set REGION=europe-west1

echo 🚀 Setting up Terraform backend for project: %PROJECT_ID%

REM Set project
gcloud config set project %PROJECT_ID%

REM Enable required APIs
echo 📋 Enabling required APIs...
gcloud services enable storage.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable cloudbuild.googleapis.com

REM Create state bucket
echo 🪣 Creating state bucket: %BUCKET_NAME%
gsutil mb -p %PROJECT_ID% -c STANDARD -l %REGION% gs://%BUCKET_NAME% 2>nul || echo Bucket already exists

REM Enable versioning on state bucket
echo 📝 Enabling versioning on state bucket...
gsutil versioning set on gs://%BUCKET_NAME%

REM Set lifecycle policy for state bucket
echo ⏰ Setting lifecycle policy for state bucket...
echo { > lifecycle.json
echo   "rule": [ >> lifecycle.json
echo     { >> lifecycle.json
echo       "action": {"type": "Delete"}, >> lifecycle.json
echo       "condition": {"age": 90} >> lifecycle.json
echo     } >> lifecycle.json
echo   ] >> lifecycle.json
echo } >> lifecycle.json
gsutil lifecycle set lifecycle.json gs://%BUCKET_NAME%
del lifecycle.json

REM Create terraform.tfvars from example
echo 📄 Creating terraform.tfvars...
if not exist "terraform\terraform.tfvars" (
    copy terraform\terraform.tfvars.example terraform\terraform.tfvars
    echo ✅ Created terraform\terraform.tfvars from example
    echo ⚠️  Please edit terraform\terraform.tfvars with your values
) else (
    echo ✅ terraform\terraform.tfvars already exists
)

echo 🎉 Terraform backend setup complete!
echo.
echo Next steps:
echo 1. Edit terraform\terraform.tfvars with your values
echo 2. Run: terraform init -backend-config=bucket=%BUCKET_NAME%
echo 3. Run: terraform plan
echo 4. Run: terraform apply
