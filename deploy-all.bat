@echo off
echo ========================================
echo 🚀 GOTSPOT - GITHUB ACTIONS DEPLOYMENT
echo ========================================
echo.

echo 📋 This script will trigger GitHub Actions deployment
echo 🔧 Make sure you have committed and pushed your changes
echo.

set /p confirm="Continue? (y/n): "
if /i not "%confirm%"=="y" (
    echo ❌ Deployment cancelled
    pause
    exit /b 0
)

echo.
echo 📤 Pushing changes to GitHub...
git add .
git commit -m "Trigger deployment via GitHub Actions"
git push origin dev

echo.
echo 🚀 GitHub Actions deployment triggered!
echo.
echo 📊 Monitor deployment at:
echo    https://github.com/%USERNAME%/GotSpot/actions
echo.
echo ⏳ Deployment will take 5-10 minutes
echo.
echo 💡 Commands:
echo    - check-status.bat    : Check deployment status
echo    - check-costs.bat     : Monitor costs
echo    - delete-all.bat      : Delete everything
echo.
pause
