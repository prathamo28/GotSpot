#!/bin/bash

# GotSpot GCP Resources Cleanup Script
# This script will clean up all GCP resources created by Terraform

set -e

PROJECT_ID="gotspot-pilot-project"
REGION="europe-west1"

echo "🧹 Starting GotSpot GCP Resources Cleanup..."
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo ""

# Set the project
gcloud config set project $PROJECT_ID

echo "1. Deleting Cloud Run service..."
gcloud run services delete gotspot-api-dev --region=$REGION --quiet || echo "Cloud Run service not found or already deleted"

echo "2. Deleting Cloud Run service (if exists from Terraform)..."
gcloud run services delete gotspot-api --region=$REGION --quiet || echo "Cloud Run service not found or already deleted"

echo "3. Deleting Cloud Storage buckets..."
gsutil rm -r gs://$PROJECT_ID-gotspot-storage* || echo "Storage buckets not found or already deleted"
gsutil rm -r gs://gotspot-terraform-state || echo "Terraform state bucket not found or already deleted"

echo "4. Running Terraform destroy..."
cd infrastructure/terraform
terraform init || echo "Terraform init failed, continuing..."
terraform destroy -var-file="environments/dev.tfvars" -auto-approve || echo "Terraform destroy failed, some resources may still exist"

echo "5. Listing remaining resources..."
echo "Remaining Cloud Run services:"
gcloud run services list --region=$REGION || echo "No Cloud Run services found"

echo "Remaining Storage buckets:"
gsutil ls || echo "No storage buckets found"

echo "Remaining Firestore databases:"
gcloud firestore databases list || echo "No Firestore databases found"

echo ""
echo "✅ Cleanup completed!"
echo "Note: Some resources like Firestore databases and IAM roles may need manual cleanup from GCP Console"
echo "Visit: https://console.cloud.google.com/"
