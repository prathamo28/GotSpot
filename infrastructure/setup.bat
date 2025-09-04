@echo off
REM GotSpot Infrastructure Setup Script for Windows
REM This script sets up everything in Google Cloud

set PROJECT_ID=gotspot-pilot-project
set REGION=europe-west1
set SERVICE_NAME=gotspot-api

echo 🚀 Setting up GotSpot Infrastructure...

REM Set project
gcloud config set project %PROJECT_ID%

REM Enable required APIs
echo 📡 Enabling APIs...
gcloud services enable run.googleapis.com firestore.googleapis.com storage.googleapis.com cloudbuild.googleapis.com logging.googleapis.com monitoring.googleapis.com maps-backend.googleapis.com places-backend.googleapis.com geocoding-backend.googleapis.com

REM Create Firestore database
echo 🗄️ Creating Firestore database...
gcloud firestore databases create --location=%REGION%

REM Create Cloud Storage bucket
echo 📦 Creating storage bucket...
gsutil mb gs://%PROJECT_ID%-gotspot-storage

REM Build and deploy the API
echo 🔨 Building and deploying API...
cd ..\backend
gcloud run deploy %SERVICE_NAME% --source . --platform managed --region %REGION% --allow-unauthenticated --memory 512Mi --cpu 1 --max-instances 10 --min-instances 0 --port 8080 --set-env-vars NODE_ENV=production,FIREBASE_PROJECT_ID=%PROJECT_ID%

echo ✅ Infrastructure setup complete!
echo 🌐 API URL: https://%SERVICE_NAME%-%REGION%-%PROJECT_ID%.a.run.app
pause
