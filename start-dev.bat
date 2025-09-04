@echo off
REM Quick Start Development Environment
REM Run this when you start working

echo 🚀 Starting GotSpot Development...
echo ================================

echo 📡 Enabling required APIs...
gcloud services enable run.googleapis.com firestore.googleapis.com storage.googleapis.com maps-backend.googleapis.com places-backend.googleapis.com

echo 🗄️ Creating Firestore database...
gcloud firestore databases create --location=europe-west1 --quiet

echo 📦 Creating storage bucket...
gsutil mb gs://gotspot-pilot-project-storage --quiet

echo 🔨 Building and deploying API...
cd backend
gcloud run deploy gotspot-api-dev --source . --platform managed --region europe-west1 --allow-unauthenticated --memory 512Mi --cpu 1 --max-instances 5 --min-instances 0 --port 8080 --set-env-vars NODE_ENV=development,FIREBASE_PROJECT_ID=gotspot-pilot-project

echo.
echo ✅ Development environment ready!
echo 🌐 API URL: https://gotspot-api-dev-europe-west1-gotspot-pilot-project.a.run.app
echo 💰 Cost: ~$0.50/day
echo.
echo 💡 To stop when done: run stop-dev.bat
echo.
pause
