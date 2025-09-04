@echo off
REM GotSpot Infrastructure Destroy Script for Windows
REM This script removes everything to save costs

echo 🗑️ Destroying GotSpot Infrastructure...

REM Navigate to terraform directory
cd terraform

REM Destroy infrastructure
echo 💥 Destroying infrastructure...
terraform destroy -auto-approve

echo ✅ Infrastructure destroyed!
echo 💰 All resources removed - costs saved!
echo 💡 To redeploy: deploy.bat
pause
