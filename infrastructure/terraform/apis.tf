# Enable required APIs
resource "google_project_service" "required_apis" {
  for_each = toset([
    "run.googleapis.com",
    "firestore.googleapis.com",
    "storage.googleapis.com",
    "cloudbuild.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "iam.googleapis.com",
    "serviceusage.googleapis.com",
  ])

  service = each.value
  disable_on_destroy = false
}

# Service Account for Cloud Run - Use data source for existing account
data "google_service_account" "gotspot_api" {
  account_id = "gotspot-api"
}

# Create a local reference for easier use
locals {
  gotspot_api_email = data.google_service_account.gotspot_api.email
}
