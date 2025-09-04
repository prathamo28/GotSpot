@echo off
REM Check Google Cloud Costs and Usage
REM Run this to monitor your spending

echo 💰 GotSpot Cost Analysis
echo =======================

echo.
echo 📊 Current Resource Usage:
echo =========================

echo.
echo 🏃 Cloud Run Services:
gcloud run services list --format="table(metadata.name,status.url,spec.template.spec.containers[0].resources.limits.memory,spec.template.spec.containers[0].resources.limits.cpu)" 2>nul
if errorlevel 1 echo    No Cloud Run services running

echo.
echo 🗄️ Firestore Databases:
gcloud firestore databases list 2>nul
if errorlevel 1 echo    No Firestore databases

echo.
echo 📦 Storage Buckets:
gsutil ls 2>nul
if errorlevel 1 echo    No storage buckets

echo.
echo 💵 Cost Estimation:
echo ==================
echo.
echo When RUNNING:
echo   - Cloud Run (512Mi, 1 CPU): ~$0.10/hour = $2.40/day
echo   - Firestore: $0.00 (Free tier)
echo   - Storage: ~$0.02/month
echo   - Maps API: Pay per use (~$0.01 per 1000 requests)
echo   - TOTAL: ~$2.50/day
echo.
echo When STOPPED:
echo   - Cloud Run: $0.00
echo   - Firestore: $0.00
echo   - Storage: ~$0.02/month
echo   - Maps API: $0.00
echo   - TOTAL: ~$0.02/month
echo.
echo 💡 Daily Savings: $2.48 (99% cost reduction!)
echo 💡 Monthly Savings: ~$75
echo.
echo 🎯 Recommendations:
echo   - Start with: start-dev.bat
echo   - Stop with: stop-dev.bat
echo   - Monitor with: check-costs.bat
echo.
pause
