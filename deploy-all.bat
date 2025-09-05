@echo off
echo ========================================
echo 🚀 GOTSPOT - ONE-CLICK GCP DEPLOYMENT
echo ========================================
echo.

echo 📋 Checking prerequisites...
gcloud --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Google Cloud CLI not found. Please install it first.
    echo 📥 Download from: https://cloud.google.com/sdk/docs/install
    pause
    exit /b 1
)

echo ✅ Google Cloud CLI found

echo.
echo 🔧 Setting up project...
gcloud config set project gotspot-pilot-project

echo.
echo 🏗️ Deploying Infrastructure with Terraform...
cd infrastructure\terraform
terraform init -upgrade
terraform plan -var-file="terraform.tfvars"
terraform apply -var-file="terraform.tfvars" -auto-approve

if %errorlevel% neq 0 (
    echo ❌ Terraform deployment failed
    pause
    exit /b 1
)

echo.
echo 🐳 Building and deploying Backend API...
cd ..\..\backend
gcloud run deploy gotspot-api --source . --platform managed --region europe-west1 --allow-unauthenticated --memory=1Gi --cpu=1 --max-instances=10

if %errorlevel% neq 0 (
    echo ❌ Backend deployment failed
    pause
    exit /b 1
)

echo.
echo 🌐 Deploying Frontend to Vercel...
cd ..
npx vercel --prod --yes

if %errorlevel% neq 0 (
    echo ❌ Frontend deployment failed
    pause
    exit /b 1
)

echo.
echo 📱 Building Mobile App...
cd mobile-app
npm install
npx expo build:android --type apk
npx expo build:ios --type archive

if %errorlevel% neq 0 (
    echo ⚠️ Mobile app build failed (optional)
)

echo.
echo ========================================
echo ✅ DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo 🌐 Frontend: https://gotspot.vercel.app
echo 🔗 Backend API: https://gotspot-api-xxxxx-ew.a.run.app
echo 📱 Mobile App: Check mobile-app/build/ folder
echo.
echo 💰 Cost Management:
echo    - Run 'check-costs.bat' to monitor costs
echo    - Run 'delete-all.bat' to delete everything
echo.
pause
