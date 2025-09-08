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
resource "google_cloud_run_service_iam_member" "public_access" {
  location = google_cloud_run_service.gotspot_api.location
  project  = google_cloud_run_service.gotspot_api.project
  service  = google_cloud_run_service.gotspot_api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
