# Cloud Run Service - Minimal configuration
resource "google_cloud_run_service" "gotspot_api" {
  name     = "gotspot-api"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/cloudrun/hello"
        ports {
          name           = "http1"
          container_port = 8080
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# IAM Policy for Cloud Run - Allow public access
# Note: This needs to be set manually via GCP Console or gcloud CLI
# gcloud run services add-iam-policy-binding gotspot-api \
#   --region=europe-west1 \
#   --member="allUsers" \
#   --role="roles/run.invoker"
