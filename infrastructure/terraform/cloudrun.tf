# Cloud Run Service
resource "google_cloud_run_service" "gotspot_api" {
  name     = "gotspot-api"
  location = var.region

  metadata {
    annotations = {
      "run.googleapis.com/ingress"             = "all"
      "run.googleapis.com/execution-environment" = "gen2"
    }
    labels = {
      "app"     = "gotspot"
      "service" = "api"
      "env"     = var.environment
    }
  }

  template {
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale"      = var.cloud_run_config.max_instances
        "autoscaling.knative.dev/minScale"      = var.cloud_run_config.min_instances
        "run.googleapis.com/cpu-throttling"     = "true"
        "run.googleapis.com/execution-environment" = "gen2"
      }
    }

    spec {
      container_concurrency = var.security_config.rate_limit
      timeout_seconds      = 300
      service_account_name = local.gotspot_api_email

      containers {
        image = "gcr.io/cloudrun/hello"

        resources {
          limits = {
            cpu    = var.cloud_run_config.cpu
            memory = var.cloud_run_config.memory
          }
        }

        env {
          name  = "NODE_ENV"
          value = var.environment
        }

        env {
          name  = "PORT"
          value = "8080"
        }

        env {
          name  = "PROJECT_ID"
          value = var.project_id
        }

        env {
          name  = "REGION"
          value = var.region
        }

        ports {
          name           = "http1"
          container_port = 8080
        }

        liveness_probe {
          http_get {
            path = "/health"
            port = 8080
          }
          initial_delay_seconds = 30
          period_seconds        = 10
          timeout_seconds       = 5
          failure_threshold     = 3
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [
    google_project_service.required_apis,
    google_firestore_database.gotspot_db
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
