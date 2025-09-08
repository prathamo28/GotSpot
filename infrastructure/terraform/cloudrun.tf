# Cloud Run Service
resource "google_cloud_run_service" "gotspot_api" {
  name     = "gotspot-api"
  location = var.region

  metadata {
    annotations = {
      "run.googleapis.com/ingress" = "all"
    }
    labels = {
      "app"     = "gotspot"
      "service" = "api"
      "env"     = var.environment
    }
  }

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

  depends_on = [
    google_project_service.required_apis
  ]
}

# IAM Policy for Cloud Run
data "google_iam_policy" "gotspot_api_policy" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

# Apply IAM Policy to Cloud Run Service
resource "google_cloud_run_service_iam_policy" "gotspot_api_policy" {
  location = google_cloud_run_service.gotspot_api.location
  project  = google_cloud_run_service.gotspot_api.project
  service  = google_cloud_run_service.gotspot_api.name

  policy_data = data.google_iam_policy.gotspot_api_policy.policy_data
}
