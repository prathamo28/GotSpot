#!/bin/bash

# Setup Terraform backend for state management
# This script creates the GCS bucket for storing Terraform state

set -e

# Configuration
PROJECT_ID=${1:-"your-gcp-project-id"}
BUCKET_NAME="gotspot-terraform-state"
REGION="europe-west1"

echo "🚀 Setting up Terraform backend for project: $PROJECT_ID"

# Set project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "📋 Enabling required APIs..."
gcloud services enable storage.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Create state bucket
echo "🪣 Creating state bucket: $BUCKET_NAME"
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$BUCKET_NAME || echo "Bucket already exists"

# Enable versioning on state bucket
echo "📝 Enabling versioning on state bucket..."
gsutil versioning set on gs://$BUCKET_NAME

# Set lifecycle policy for state bucket
echo "⏰ Setting lifecycle policy for state bucket..."
cat > lifecycle.json << EOF
{
  "rule": [
    {
      "action": {"type": "Delete"},
      "condition": {"age": 90}
    }
  ]
}
EOF
gsutil lifecycle set lifecycle.json gs://$BUCKET_NAME
rm lifecycle.json

# Create terraform.tfvars from example
echo "📄 Creating terraform.tfvars..."
if [ ! -f "terraform/terraform.tfvars" ]; then
    cp terraform/terraform.tfvars.example terraform/terraform.tfvars
    echo "✅ Created terraform/terraform.tfvars from example"
    echo "⚠️  Please edit terraform/terraform.tfvars with your values"
else
    echo "✅ terraform/terraform.tfvars already exists"
fi

echo "🎉 Terraform backend setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit terraform/terraform.tfvars with your values"
echo "2. Run: terraform init -backend-config=bucket=$BUCKET_NAME"
echo "3. Run: terraform plan"
echo "4. Run: terraform apply"
