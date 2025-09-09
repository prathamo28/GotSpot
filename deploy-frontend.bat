@echo off
echo 🚀 GotSpot Frontend Deployment Script
echo =====================================

set PROJECT_ID=%1
if "%PROJECT_ID%"=="" (
    echo ❌ Please provide project ID
    echo Usage: deploy-frontend.bat YOUR_PROJECT_ID
    exit /b 1
)

echo 📋 Project ID: %PROJECT_ID%

REM Step 1: Setup Terraform backend
echo.
echo Step 1: Setting up Terraform backend...
call scripts\setup-terraform-backend.bat %PROJECT_ID%

REM Step 2: Initialize Terraform
echo.
echo Step 2: Initializing Terraform...
cd terraform
terraform init

REM Step 3: Plan deployment
echo.
echo Step 3: Planning deployment...
terraform plan -var-file="terraform.tfvars"

REM Step 4: Apply infrastructure
echo.
echo Step 4: Applying infrastructure...
echo ⚠️  This will create GCP resources. Continue? (y/N)
set /p confirm=
if /i "%confirm%" neq "y" (
    echo ❌ Deployment cancelled
    exit /b 1
)

terraform apply -var-file="terraform.tfvars"

REM Step 5: Get outputs
echo.
echo Step 5: Getting deployment outputs...
echo.
echo 🎉 Deployment complete!
echo.
echo 📋 Next steps:
echo 1. Add GitHub secrets (see GITHUB_SECRETS_SETUP.md)
echo 2. Push to dev branch to trigger frontend deployment
echo 3. Check GitHub Actions for deployment status
echo.
echo 📊 Terraform outputs:
terraform output

cd ..
echo.
echo ✅ Setup complete! Check the outputs above for your frontend URL.
