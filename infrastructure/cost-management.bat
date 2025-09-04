@echo off
REM GotSpot Cost Management Script
REM This script helps you manage Google Cloud costs efficiently

echo 💰 GotSpot Cost Management
echo =========================

:menu
echo.
echo Choose an option:
echo 1. 🚀 Start Development (Deploy everything)
echo 2. 🛑 Stop Development (Destroy everything)
echo 3. 📊 Check Current Costs
echo 4. 🔍 List Resources
echo 5. 🧹 Clean Up Everything
echo 6. ❌ Exit
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto deploy
if "%choice%"=="2" goto destroy
if "%choice%"=="3" goto costs
if "%choice%"=="4" goto list
if "%choice%"=="5" goto cleanup
if "%choice%"=="6" goto exit
goto menu

:deploy
echo.
echo 🚀 Starting Development Environment...
echo =====================================
cd terraform
terraform init
terraform plan -var="environment=dev"
terraform apply -auto-approve -var="environment=dev"
echo.
echo ✅ Development environment deployed!
echo 💡 Cost: ~$0.50/day when running
echo.
pause
goto menu

:destroy
echo.
echo 🛑 Stopping Development Environment...
echo =====================================
cd terraform
terraform destroy -auto-approve -var="environment=dev"
echo.
echo ✅ Development environment destroyed!
echo 💰 Cost saved: ~$2.50/day
echo.
pause
goto menu

:costs
echo.
echo 📊 Checking Current Costs...
echo ===========================
echo.
echo Checking Cloud Run services...
gcloud run services list --format="table(metadata.name,status.url,spec.template.spec.containers[0].resources.limits.memory,spec.template.spec.containers[0].resources.limits.cpu)"
echo.
echo Checking Firestore usage...
gcloud firestore databases list
echo.
echo Checking Storage usage...
gsutil du -sh gs://gotspot-pilot-project-storage
echo.
echo 💡 Estimated daily cost: ~$2.50 when running
echo.
pause
goto menu

:list
echo.
echo 🔍 Listing All Resources...
echo ==========================
echo.
echo Cloud Run Services:
gcloud run services list
echo.
echo Firestore Databases:
gcloud firestore databases list
echo.
echo Storage Buckets:
gsutil ls
echo.
echo Compute Instances:
gcloud compute instances list
echo.
pause
goto menu

:cleanup
echo.
echo 🧹 Complete Cleanup...
echo =====================
echo.
echo This will remove ALL GotSpot resources!
set /p confirm="Are you sure? (y/N): "
if /i not "%confirm%"=="y" goto menu

echo.
echo Removing Cloud Run services...
gcloud run services delete gotspot-api-dev --region=europe-west1 --quiet
gcloud run services delete gotspot-api-uat --region=europe-west1 --quiet
gcloud run services delete gotspot-api-preprod --region=europe-west1 --quiet
gcloud run services delete gotspot-api --region=europe-west1 --quiet

echo.
echo Removing Firestore database...
gcloud firestore databases delete --database="(default)" --quiet

echo.
echo Removing Storage bucket...
gsutil rm -r gs://gotspot-pilot-project-storage

echo.
echo ✅ Complete cleanup finished!
echo 💰 All costs eliminated!
echo.
pause
goto menu

:exit
echo.
echo 👋 Goodbye! Remember to stop resources when not developing.
echo.
exit
