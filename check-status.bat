@echo off
echo ========================================
echo 📊 GOTSPOT - INFRASTRUCTURE STATUS
echo ========================================
echo.

echo 🔍 Checking Google Cloud Project...
gcloud config get-value project

echo.
echo 🏗️ Checking Terraform State...
cd infrastructure\terraform
terraform show -json | findstr "gotspot" >nul
if %errorlevel% equ 0 (
    echo ✅ Infrastructure deployed
) else (
    echo ❌ Infrastructure not deployed
)

echo.
echo 🐳 Checking Cloud Run Services...
gcloud run services list --filter="metadata.name:gotspot" --format="table(metadata.name,status.url,status.conditions[0].status)"

echo.
echo 🗄️ Checking Firestore Database...
gcloud firestore databases list --format="table(name,type,locationId)"

echo.
echo 🪣 Checking Cloud Storage Buckets...
gcloud storage buckets list --filter="name:gotspot" --format="table(name,location,storageClass)"

echo.
echo 🔐 Checking Service Accounts...
gcloud iam service-accounts list --filter="displayName:GotSpot" --format="table(email,displayName)"

echo.
echo 💰 Checking Billing...
gcloud billing accounts list --format="table(name,displayName,open)"

echo.
echo 📈 Checking API Usage...
gcloud services list --enabled --filter="name:run.googleapis.com OR name:firestore.googleapis.com OR name:storage.googleapis.com" --format="table(name,title)"

echo.
echo ========================================
echo 📊 STATUS CHECK COMPLETE
echo ========================================
echo.
echo 💡 Commands:
echo    - deploy-all.bat    : Deploy everything
echo    - delete-all.bat    : Delete everything
echo    - check-costs.bat   : Check costs
echo.
pause
