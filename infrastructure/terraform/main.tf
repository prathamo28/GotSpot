# GotSpot Complete Infrastructure as Code
terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Variables are defined in variables.tf

# Enable required APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "run.googleapis.com",
    "firestore.googleapis.com",
    "storage.googleapis.com",
    "cloudbuild.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com",
    "maps.googleapis.com",
    "places.googleapis.com",
    "geocoding.googleapis.com",
    "directions.googleapis.com",
    "maps-backend.googleapis.com",
    "places-backend.googleapis.com",
    "geocoding-backend.googleapis.com",
  ])

  service = each.value
  disable_on_destroy = false
}

# Service Account for Cloud Run
resource "google_service_account" "gotspot_api" {
  account_id   = "gotspot-api"
  display_name = "GotSpot API Service Account"
  description  = "Service account for GotSpot API"
}

# IAM Bindings for Service Account
resource "google_project_iam_member" "firestore_user" {
  project = var.project_id
  role    = "roles/firestore.user"
  member  = "serviceAccount:${google_service_account.gotspot_api.email}"
}

resource "google_project_iam_member" "storage_object_viewer" {
  project = var.project_id
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${google_service_account.gotspot_api.email}"
}

resource "google_project_iam_member" "maps_api_user" {
  project = var.project_id
  role    = "roles/maps.placesApiUser"
  member  = "serviceAccount:${google_service_account.gotspot_api.email}"
}

# Firestore Database
resource "google_firestore_database" "gotspot_db" {
  project     = var.project_id
  name        = "(default)"
  location_id = var.region
  type        = "FIRESTORE_NATIVE"
  depends_on  = [google_project_service.required_apis]
}

# Cloud Storage Bucket
resource "google_storage_bucket" "gotspot_storage" {
  name          = "${var.project_id}-gotspot-storage"
  location      = var.region
  force_destroy = true

  uniform_bucket_level_access = true

  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type = "Delete"
    }
  }

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

# Cloud Run Service
resource "google_cloud_run_service" "gotspot_api" {
  name     = "gotspot-api"
  location = var.region

  template {
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = "10"
        "autoscaling.knative.dev/minScale" = "0"
        "run.googleapis.com/cpu-throttling" = "true"
        "run.googleapis.com/execution-environment" = "gen2"
      }
    }

    spec {
      container_concurrency = 100
      timeout_seconds      = 300
      service_account_name = google_service_account.gotspot_api.email

      containers {
        image = "gcr.io/${var.project_id}/gotspot-api:latest"

        resources {
          limits = {
            cpu    = "1"
            memory = "512Mi"
          }
          requests = {
            cpu    = "0.5"
            memory = "256Mi"
          }
        }

        env {
          name  = "NODE_ENV"
          value = var.environment
        }

        env {
          name  = "FIREBASE_PROJECT_ID"
          value = var.project_id
        }

        env {
          name  = "GOOGLE_MAPS_API_KEY"
          value = var.google_maps_api_key
        }

        env {
          name  = "JWT_SECRET"
          value = var.jwt_secret
        }

        ports {
          container_port = 8080
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [google_project_service.required_apis]
}

# IAM Policy for Cloud Run
resource "google_cloud_run_service_iam_policy" "gotspot_api_policy" {
  location = google_cloud_run_service.gotspot_api.location
  project  = google_cloud_run_service.gotspot_api.project
  service  = google_cloud_run_service.gotspot_api.name

  policy_data = data.google_iam_policy.gotspot_api_policy.policy_data
}

data "google_iam_policy" "gotspot_api_policy" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

# Cloud Build Trigger
resource "google_cloudbuild_trigger" "gotspot_trigger" {
  name        = "gotspot-api-trigger"
  description = "Build and deploy GotSpot API"

  github {
    owner = var.github_owner
    name  = var.github_repo
    push {
      branch = "^main$"
    }
  }

  filename = "backend/cloudbuild.yaml"

  substitutions = {
    _PROJECT_ID = var.project_id
    _REGION     = var.region
  }
}

# Logging
resource "google_logging_project_sink" "gotspot_logs" {
  name        = "gotspot-logs"
  destination = "storage.googleapis.com/${google_storage_bucket.gotspot_storage.name}/logs"

  filter = "resource.type=cloud_run_revision AND resource.labels.service_name=gotspot-api"
}

# Monitoring
resource "google_monitoring_alert_policy" "gotspot_errors" {
  display_name = "GotSpot API Errors"
  combiner     = "OR"
  conditions {
    display_name = "Error rate too high"
    condition_threshold {
      filter          = "resource.type=cloud_run_revision AND resource.labels.service_name=gotspot-api"
      duration        = "300s"
      comparison      = "COMPARISON_GREATER_THAN"
      threshold_value = 0.05
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_RATE"
      }
    }
  }
}

resource "google_monitoring_alert_policy" "gotspot_latency" {
  display_name = "GotSpot API High Latency"
  combiner     = "OR"
  conditions {
    display_name = "Latency too high"
    condition_threshold {
      filter          = "resource.type=cloud_run_revision AND resource.labels.service_name=gotspot-api"
      duration        = "300s"
      comparison      = "COMPARISON_GREATER_THAN"
      threshold_value = 2.0
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_MEAN"
      }
    }
  }
}

# Cost Monitoring
resource "google_monitoring_alert_policy" "gotspot_cost" {
  display_name = "GotSpot High Cost"
  combiner     = "OR"
  conditions {
    display_name = "Daily cost too high"
    condition_threshold {
      filter          = "resource.type=billing_account"
      duration        = "300s"
      comparison      = "COMPARISON_GREATER_THAN"
      threshold_value = 50.0
      aggregations {
        alignment_period   = "86400s"
        per_series_aligner = "ALIGN_SUM"
      }
    }
  }
}

# Outputs
output "api_url" {
  description = "GotSpot API URL"
  value       = google_cloud_run_service.gotspot_api.status[0].url
}

output "firestore_database" {
  description = "Firestore database name"
  value       = google_firestore_database.gotspot_db.name
}

output "storage_bucket" {
  description = "Cloud Storage bucket name"
  value       = google_storage_bucket.gotspot_storage.name
}
