@echo off
echo ========================================
echo 🔧 FIXING PACKAGE LOCK SYNC ISSUES
echo ========================================
echo.

echo 📦 Regenerating package-lock.json files...
echo.

echo 🔧 Fixing backend package-lock.json...
cd backend
if exist package-lock.json del package-lock.json
npm install
cd ..

echo.
echo 🔧 Fixing mobile-app package-lock.json...
cd mobile-app
if exist package-lock.json del package-lock.json
npm install
cd ..

echo.
echo ✅ Package lock files regenerated!
echo.
echo 📤 Committing and pushing changes...
git add .
git commit -m "Fix package-lock.json sync issues"
git push origin dev

echo.
echo 🚀 Changes pushed! GitHub Actions should now work.
echo.
pause
