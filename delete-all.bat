@echo off
echo ========================================
echo 🗑️ GOTSPOT - GITHUB ACTIONS DELETION
echo ========================================
echo.

echo ⚠️ WARNING: This will delete ALL GotSpot resources!
echo 💰 This will stop all costs immediately.
echo.
echo 🔧 This will trigger GitHub Actions to destroy infrastructure
echo.

set /p confirm="Are you sure? Type 'DELETE' to confirm: "
if not "%confirm%"=="DELETE" (
    echo ❌ Deletion cancelled
    pause
    exit /b 0
)

echo.
echo 📤 Triggering GitHub Actions destruction...
git add .
git commit -m "Trigger infrastructure destruction via GitHub Actions"
git push origin dev

echo.
echo 🗑️ GitHub Actions destruction triggered!
echo.
echo 📊 Monitor destruction at:
echo    https://github.com/%USERNAME%/GotSpot/actions
echo.
echo ⏳ Destruction will take 3-5 minutes
echo.
echo 🧹 Cleaning up local files...
if exist "backend\dist" rmdir /s /q "backend\dist"
if exist "mobile-app\build" rmdir /s /q "mobile-app\build"
if exist "mobile-app\node_modules" rmdir /s /q "mobile-app\node_modules"

echo.
echo ========================================
echo ✅ DELETION TRIGGERED!
echo ========================================
echo.
echo 💰 All costs will be stopped
echo 🧹 All resources will be deleted
echo 📁 Local build files cleaned
echo.
echo 💡 To redeploy, run 'deploy-all.bat'
echo.
pause
