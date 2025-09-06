@echo off
echo ========================================
echo GotSpot GCP Setup Script
echo ========================================
echo.

REM Set your project ID
set PROJECT_ID=gotspot-pilot-project
set SERVICE_ACCOUNT_NAME=gotspot-github-actions
set KEY_FILE=gotspot-sa-key.json

echo Step 1: Creating service account...
gcloud iam service-accounts create %SERVICE_ACCOUNT_NAME% ^
    --display-name="GotSpot GitHub Actions" ^
    --description="Service account for GitHub Actions CI/CD" ^
    --project=%PROJECT_ID%

if %ERRORLEVEL% neq 0 (
    echo Error creating service account. It might already exist.
    echo Continuing...
)

echo.
echo Step 2: Granting permissions...
gcloud projects add-iam-policy-binding %PROJECT_ID% ^
    --member="serviceAccount:%SERVICE_ACCOUNT_NAME%@%PROJECT_ID%.iam.gserviceaccount.com" ^
    --role="roles/editor"

gcloud projects add-iam-policy-binding %PROJECT_ID% ^
    --member="serviceAccount:%SERVICE_ACCOUNT_NAME%@%PROJECT_ID%.iam.gserviceaccount.com" ^
    --role="roles/firestore.user"

gcloud projects add-iam-policy-binding %PROJECT_ID% ^
    --member="serviceAccount:%SERVICE_ACCOUNT_NAME%@%PROJECT_ID%.iam.gserviceaccount.com" ^
    --role="roles/storage.objectViewer"

gcloud projects add-iam-policy-binding %PROJECT_ID% ^
    --member="serviceAccount:%SERVICE_ACCOUNT_NAME%@%PROJECT_ID%.iam.gserviceaccount.com" ^
    --role="roles/maps.placesApiUser"

echo.
echo Step 3: Creating service account key...
gcloud iam service-accounts keys create %KEY_FILE% ^
    --iam-account=%SERVICE_ACCOUNT_NAME%@%PROJECT_ID%.iam.gserviceaccount.com ^
    --project=%PROJECT_ID%

if %ERRORLEVEL% neq 0 (
    echo Error creating service account key.
    pause
    exit /b 1
)

echo.
echo Step 4: Displaying the service account key...
echo ========================================
echo COPY THE JSON BELOW TO GITHUB SECRETS
echo ========================================
type %KEY_FILE%
echo ========================================
echo.

echo Step 5: Generating JWT Secret...
echo JWT_SECRET=gotspot-jwt-secret-%RANDOM%-%RANDOM%-%RANDOM%
echo.

echo ========================================
echo SETUP INSTRUCTIONS:
echo ========================================
echo 1. Copy the JSON above to GitHub Secrets as 'GCP_SA_KEY'
echo 2. Copy the JWT_SECRET above to GitHub Secrets as 'JWT_SECRET'
echo 3. Get your Google Maps API key from Google Cloud Console
echo 4. Add it to GitHub Secrets as 'GOOGLE_MAPS_API_KEY'
echo.
echo GitHub Secrets URL:
echo https://github.com/prathamo28/GotSpot/settings/secrets/actions
echo.

pause
