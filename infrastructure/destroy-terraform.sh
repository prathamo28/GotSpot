#!/bin/bash

# GotSpot Terraform Destroy Script
# This script destroys everything managed by Terraform

set -e

echo "🗑️ Destroying GotSpot Infrastructure with Terraform..."

# Navigate to terraform directory
cd terraform

# Destroy infrastructure
echo "💥 Destroying infrastructure..."
terraform destroy -auto-approve

echo "✅ Infrastructure destroyed!"
echo "💰 All resources removed - costs saved!"
echo "💡 To redeploy: ./deploy.sh"
