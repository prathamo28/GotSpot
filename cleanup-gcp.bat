@echo off
echo 🧹 Cleaning up GCP resources...
echo ===============================

set PROJECT_ID=gotspot-pilot-project
set REGION=europe-west1

echo Setting project...
gcloud config set project %PROJECT_ID%

echo Deleting Cloud Run services...
gcloud run services delete gotspot-api --region=%REGION% --quiet || echo "No Cloud Run service found"
gcloud run services delete gotspot-api-dev --region=%REGION% --quiet || echo "No dev Cloud Run service found"

echo Deleting storage buckets...
gcloud storage buckets delete gs://%PROJECT_ID%-storage --force || echo "Storage bucket not found"
gcloud storage buckets delete gs://%PROJECT_ID%-gotspot-storage --force || echo "Storage bucket not found"
gcloud storage buckets delete gs://gotspot-terraform-state --force || echo "Terraform state bucket not found"

echo Deleting Firestore database...
gcloud firestore databases delete --database=(default) --quiet || echo "Firestore database not found"

echo Deleting service accounts...
gcloud iam service-accounts delete gotspot-api@%PROJECT_ID%.iam.gserviceaccount.com --quiet || echo "Service account not found"
gcloud iam service-accounts delete gotspot-terraform-sa@%PROJECT_ID%.iam.gserviceaccount.com --quiet || echo "Terraform service account not found"

echo ✅ GCP cleanup complete!
pause
