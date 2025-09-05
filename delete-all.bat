@echo off
echo ========================================
echo 🗑️ GOTSPOT - ONE-CLICK GCP DELETION
echo ========================================
echo.

echo ⚠️ WARNING: This will delete ALL GotSpot resources!
echo 💰 This will stop all costs immediately.
echo.
set /p confirm="Are you sure? Type 'DELETE' to confirm: "
if not "%confirm%"=="DELETE" (
    echo ❌ Deletion cancelled
    pause
    exit /b 0
)

echo.
echo 🧹 Cleaning up Google Cloud resources...

echo.
echo 🏗️ Destroying Infrastructure with Terraform...
cd infrastructure\terraform
terraform destroy -var-file="terraform.tfvars" -auto-approve

echo.
echo 🐳 Deleting Cloud Run services...
gcloud run services delete gotspot-api --region europe-west1 --quiet

echo.
echo 🗄️ Deleting Firestore database...
gcloud firestore databases delete --database=(default) --quiet

echo.
echo 🪣 Deleting Cloud Storage buckets...
for /f "tokens=*" %%i in ('gcloud storage buckets list --format="value(name)"') do (
    if "%%i" neq "" (
        echo Deleting bucket: %%i
        gcloud storage rm -r gs://%%i --quiet
    )
)

echo.
echo 🔐 Deleting service accounts...
gcloud iam service-accounts list --format="value(email)" | findstr gotspot | for /f "tokens=*" %%i in ('more') do (
    gcloud iam service-accounts delete %%i --quiet
)

echo.
echo 🏷️ Deleting IAM policies...
gcloud projects remove-iam-policy-binding gotspot-pilot-project --member="serviceAccount:gotspot-api@gotspot-pilot-project.iam.gserviceaccount.com" --role="roles/firestore.user" --quiet
gcloud projects remove-iam-policy-binding gotspot-pilot-project --member="serviceAccount:gotspot-api@gotspot-pilot-project.iam.gserviceaccount.com" --role="roles/storage.objectViewer" --quiet

echo.
echo 🧹 Cleaning up local files...
cd ..\..
if exist "backend\dist" rmdir /s /q "backend\dist"
if exist "mobile-app\build" rmdir /s /q "mobile-app\build"
if exist "mobile-app\node_modules" rmdir /s /q "mobile-app\node_modules"

echo.
echo ========================================
echo ✅ DELETION COMPLETE!
echo ========================================
echo.
echo 💰 All costs stopped
echo 🧹 All resources deleted
echo 📁 Local build files cleaned
echo.
echo 💡 To redeploy, run 'deploy-all.bat'
echo.
pause
