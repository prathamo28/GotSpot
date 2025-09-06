# GotSpot GCP Setup Script
Write-Host "========================================" -ForegroundColor Green
Write-Host "GotSpot GCP Setup Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Set your project ID
$PROJECT_ID = "gotspot-pilot-project"
$SERVICE_ACCOUNT_NAME = "gotspot-github-actions"
$KEY_FILE = "gotspot-sa-key.json"

Write-Host "Step 1: Creating service account..." -ForegroundColor Yellow
try {
    gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME `
        --display-name="GotSpot GitHub Actions" `
        --description="Service account for GitHub Actions CI/CD" `
        --project=$PROJECT_ID
    Write-Host "Service account created successfully!" -ForegroundColor Green
} catch {
    Write-Host "Service account might already exist. Continuing..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 2: Granting permissions..." -ForegroundColor Yellow

# Grant Editor role
gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" `
    --role="roles/editor"

# Grant Firestore role
gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" `
    --role="roles/firestore.user"

# Grant Storage role
gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" `
    --role="roles/storage.objectViewer"

# Grant Maps API role
gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" `
    --role="roles/maps.placesApiUser"

Write-Host "Permissions granted successfully!" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Creating service account key..." -ForegroundColor Yellow
gcloud iam service-accounts keys create $KEY_FILE `
    --iam-account="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com" `
    --project=$PROJECT_ID

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error creating service account key." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Service account key created successfully!" -ForegroundColor Green

Write-Host ""
Write-Host "Step 4: Displaying the service account key..." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "COPY THE JSON BELOW TO GITHUB SECRETS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Get-Content $KEY_FILE
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Step 5: Generating JWT Secret..." -ForegroundColor Yellow
$JWT_SECRET = "gotspot-jwt-secret-$(Get-Random)-$(Get-Random)-$(Get-Random)"
Write-Host "JWT_SECRET=$JWT_SECRET" -ForegroundColor Cyan

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "SETUP INSTRUCTIONS:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "1. Copy the JSON above to GitHub Secrets as 'GCP_SA_KEY'" -ForegroundColor White
Write-Host "2. Copy the JWT_SECRET above to GitHub Secrets as 'JWT_SECRET'" -ForegroundColor White
Write-Host "3. Get your Google Maps API key from Google Cloud Console" -ForegroundColor White
Write-Host "4. Add it to GitHub Secrets as 'GOOGLE_MAPS_API_KEY'" -ForegroundColor White
Write-Host ""
Write-Host "GitHub Secrets URL:" -ForegroundColor Yellow
Write-Host "https://github.com/prathamo28/GotSpot/settings/secrets/actions" -ForegroundColor Blue
Write-Host ""

Read-Host "Press Enter to continue"
