# Generate clean service account key
Write-Host "Generating clean service account key..." -ForegroundColor Green

# Create the key
gcloud iam service-accounts keys create gotspot-sa-clean.json --iam-account=gotspot-github-actions@gotspot-pilot-project.iam.gserviceaccount.com --project=gotspot-pilot-project

# Read and clean the JSON
$jsonContent = Get-Content gotspot-sa-clean.json -Raw
$cleanJson = $jsonContent | ConvertFrom-Json | ConvertTo-Json -Depth 10

# Write clean JSON to file
$cleanJson | Out-File -FilePath gotspot-sa-clean.json -Encoding UTF8

Write-Host "Clean JSON generated:" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Get-Content gotspot-sa-clean.json
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Copy the JSON above to GitHub Secrets as 'GCP_SA_KEY'" -ForegroundColor Green
