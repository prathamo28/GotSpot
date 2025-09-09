@echo off
REM GotSpot GCP Resources Cleanup Script for Windows
REM This script will clean up all GCP resources created by Terraform

set PROJECT_ID=gotspot-pilot-project
set REGION=europe-west1

echo 🧹 Starting GotSpot GCP Resources Cleanup...
echo Project: %PROJECT_ID%
echo Region: %REGION%
echo.

REM Set the project
gcloud config set project %PROJECT_ID%

echo 1. Deleting Cloud Run service...
gcloud run services delete gotspot-api-dev --region=%REGION% --quiet
if errorlevel 1 echo Cloud Run service not found or already deleted

echo 2. Deleting Cloud Run service (if exists from Terraform)...
gcloud run services delete gotspot-api --region=%REGION% --quiet
if errorlevel 1 echo Cloud Run service not found or already deleted

echo 3. Deleting Cloud Storage buckets...
gsutil rm -r gs://%PROJECT_ID%-gotspot-storage*
if errorlevel 1 echo Storage buckets not found or already deleted

gsutil rm -r gs://gotspot-terraform-state
if errorlevel 1 echo Terraform state bucket not found or already deleted

echo 4. Running Terraform destroy...
cd infrastructure\terraform
terraform init
if errorlevel 1 echo Terraform init failed, continuing...

terraform destroy -var-file="environments\dev.tfvars" -auto-approve
if errorlevel 1 echo Terraform destroy failed, some resources may still exist

echo 5. Listing remaining resources...
echo Remaining Cloud Run services:
gcloud run services list --region=%REGION%
if errorlevel 1 echo No Cloud Run services found

echo Remaining Storage buckets:
gsutil ls
if errorlevel 1 echo No storage buckets found

echo Remaining Firestore databases:
gcloud firestore databases list
if errorlevel 1 echo No Firestore databases found

echo.
echo ✅ Cleanup completed!
echo Note: Some resources like Firestore databases and IAM roles may need manual cleanup from GCP Console
echo Visit: https://console.cloud.google.com/
pause
