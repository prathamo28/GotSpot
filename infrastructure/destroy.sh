#!/bin/bash

# GotSpot Infrastructure Destroy Script
# This script removes everything to save costs

set -e

PROJECT_ID="gotspot-pilot-project"
REGION="europe-west1"
SERVICE_NAME="gotspot-api"

echo "🗑️ Destroying GotSpot Infrastructure..."

# Set project
gcloud config set project $PROJECT_ID

# Delete Cloud Run service
echo "🛑 Deleting Cloud Run service..."
gcloud run services delete $SERVICE_NAME --region=$REGION --quiet || echo "Service not found"

# Delete Firestore database
echo "🗄️ Deleting Firestore database..."
gcloud firestore databases delete --database="(default)" --quiet || echo "Database not found"

# Delete Cloud Storage bucket
echo "📦 Deleting storage bucket..."
gsutil rm -r gs://$PROJECT_ID-gotspot-storage || echo "Bucket not found"

# Disable APIs to save costs
echo "💰 Disabling APIs to save costs..."
gcloud services disable run.googleapis.com \
  firestore.googleapis.com \
  storage.googleapis.com \
  cloudbuild.googleapis.com \
  logging.googleapis.com \
  monitoring.googleapis.com \
  maps-backend.googleapis.com \
  places-backend.googleapis.com \
  geocoding-backend.googleapis.com

echo "✅ Infrastructure destroyed! Costs saved."
echo "💡 To redeploy, run: ./infrastructure/setup.sh"
