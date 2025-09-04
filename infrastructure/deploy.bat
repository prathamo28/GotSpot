@echo off
REM GotSpot Complete Deployment Script for Windows
REM This script deploys everything using Terraform

echo 🚀 Deploying GotSpot Infrastructure with Terraform...

REM Check if terraform.tfvars exists
if not exist "terraform\terraform.tfvars" (
    echo ❌ terraform.tfvars not found!
    echo 📝 Please copy terraform.tfvars.example to terraform.tfvars and fill in your values
    echo    copy terraform\terraform.tfvars.example terraform\terraform.tfvars
    pause
    exit /b 1
)

REM Navigate to terraform directory
cd terraform

REM Initialize Terraform
echo 🔧 Initializing Terraform...
terraform init

REM Plan deployment
echo 📋 Planning deployment...
terraform plan

REM Apply deployment
echo 🚀 Deploying infrastructure...
terraform apply -auto-approve

REM Get outputs
echo ✅ Deployment complete!
echo 🌐 API URL: 
terraform output -raw api_url
echo 🗄️ Firestore: 
terraform output -raw firestore_database
echo 📦 Storage: 
terraform output -raw storage_bucket

echo.
echo 💡 To destroy everything: destroy.bat
echo 💡 To redeploy: deploy.bat
pause
