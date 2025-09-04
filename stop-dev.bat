@echo off
REM Quick Stop Development Environment
REM Run this when you finish working

echo 🛑 Stopping GotSpot Development...
echo =================================

echo 🗑️ Deleting Cloud Run service...
gcloud run services delete gotspot-api-dev --region=europe-west1 --quiet

echo 🗄️ Deleting Firestore database...
gcloud firestore databases delete --database="(default)" --quiet

echo 📦 Deleting storage bucket...
gsutil rm -r gs://gotspot-pilot-project-storage --quiet

echo.
echo ✅ Development environment stopped!
echo 💰 Cost saved: ~$2.50/day
echo.
echo 💡 To start again: run start-dev.bat
echo.
pause
