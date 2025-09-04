@echo off
REM GotSpot Branch Setup Script for Windows
REM This script creates the proper branch structure for CI/CD

echo 🌳 Setting up GotSpot branch structure...

REM Check if we're in a git repository
if not exist ".git" (
    echo ❌ Not in a git repository. Please run 'git init' first.
    pause
    exit /b 1
)

REM Create branches
echo 📝 Creating branches...

REM Create dev branch
git checkout -b dev 2>nul || git checkout dev
echo ✅ Created/checked out dev branch

REM Create uat branch
git checkout -b uat 2>nul || git checkout uat
echo ✅ Created/checked out uat branch

REM Create pre-prod branch
git checkout -b pre-prod 2>nul || git checkout pre-prod
echo ✅ Created/checked out pre-prod branch

REM Return to main branch
git checkout main 2>nul || git checkout -b main
echo ✅ Created/checked out main branch

REM Create initial commit if needed
git log --oneline -1 >nul 2>&1
if errorlevel 1 (
    echo 📝 Creating initial commit...
    git add .
    git commit -m "Initial commit: GotSpot project setup"
    echo ✅ Initial commit created
)

REM Push all branches
echo 🚀 Pushing branches to remote...
git push -u origin main
git push -u origin dev
git push -u origin uat
git push -u origin pre-prod
echo ✅ All branches pushed to remote

echo.
echo 🎉 Branch structure setup complete!
echo.
echo 📋 Branch structure:
echo    main (production) ← pre-prod ← uat ← dev
echo.
echo 🔄 Development workflow:
echo    1. Work on feature branches from dev
echo    2. Merge to dev for development testing
echo    3. Merge dev → uat for UAT testing
echo    4. Merge uat → pre-prod for pre-production testing
echo    5. Merge pre-prod → main for production deployment
echo.
echo 🛡️ Security scanning:
echo    - dev: Basic security scans
echo    - uat: Comprehensive security scans
echo    - pre-prod: Production-level security scans
echo    - main: Critical security scans only
echo.
echo 💡 Next steps:
echo    1. Set up GitHub secrets (GCP_SA_KEY, SNYK_TOKEN, etc.)
echo    2. Start developing on feature branches
echo    3. Monitor security reports in GitHub Actions
echo.
echo Happy coding! 🚀
pause
