@echo off
echo 🚀 Quick Deploy to Google Cloud Run
echo.

echo 📦 Building Docker image...
docker build -t gcr.io/gotspot-pilot-project/gotspot-api:latest ./backend

echo 🚀 Pushing to Google Container Registry...
docker push gcr.io/gotspot-pilot-project/gotspot-api:latest

echo 🎯 Deploying to Cloud Run...
gcloud run deploy gotspot-api --image gcr.io/gotspot-pilot-project/gotspot-api:latest --platform managed --region europe-west1 --allow-unauthenticated

echo ✅ Deployment complete!
pause
