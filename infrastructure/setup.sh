#!/bin/bash

# GotSpot Infrastructure Setup Script
# This script sets up everything in Google Cloud

set -e

PROJECT_ID="gotspot-pilot-project"
REGION="europe-west1"
SERVICE_NAME="gotspot-api"

echo "🚀 Setting up GotSpot Infrastructure..."

# Set project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "📡 Enabling APIs..."
gcloud services enable run.googleapis.com \
  firestore.googleapis.com \
  storage.googleapis.com \
  cloudbuild.googleapis.com \
  logging.googleapis.com \
  monitoring.googleapis.com \
  maps-backend.googleapis.com \
  places-backend.googleapis.com \
  geocoding-backend.googleapis.com

# Create Firestore database
echo "🗄️ Creating Firestore database..."
gcloud firestore databases create --location=$REGION || echo "Database already exists"

# Create Cloud Storage bucket
echo "📦 Creating storage bucket..."
gsutil mb gs://$PROJECT_ID-gotspot-storage || echo "Bucket already exists"

# Build and deploy the API
echo "🔨 Building and deploying API..."
cd ../backend
gcloud run deploy $SERVICE_NAME \
  --source . \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --min-instances 0 \
  --port 8080 \
  --set-env-vars NODE_ENV=production,FIREBASE_PROJECT_ID=$PROJECT_ID

echo "✅ Infrastructure setup complete!"
echo "🌐 API URL: https://$SERVICE_NAME-$REGION-$PROJECT_ID.a.run.app"
