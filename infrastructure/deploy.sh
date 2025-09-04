#!/bin/bash

# GotSpot Complete Deployment Script
# This script deploys everything using Terraform

set -e

echo "🚀 Deploying GotSpot Infrastructure with Terraform..."

# Check if terraform.tfvars exists
if [ ! -f "terraform/terraform.tfvars" ]; then
  echo "❌ terraform.tfvars not found!"
  echo "📝 Please copy terraform.tfvars.example to terraform.tfvars and fill in your values"
  echo "   cp terraform/terraform.tfvars.example terraform/terraform.tfvars"
  exit 1
fi

# Navigate to terraform directory
cd terraform

# Initialize Terraform
echo "🔧 Initializing Terraform..."
terraform init

# Plan deployment
echo "📋 Planning deployment..."
terraform plan

# Apply deployment
echo "🚀 Deploying infrastructure..."
terraform apply -auto-approve

# Get outputs
echo "✅ Deployment complete!"
echo "🌐 API URL: $(terraform output -raw api_url)"
echo "🗄️ Firestore: $(terraform output -raw firestore_database)"
echo "📦 Storage: $(terraform output -raw storage_bucket)"

echo ""
echo "💡 To destroy everything: ./destroy.sh"
echo "💡 To redeploy: ./deploy.sh"
