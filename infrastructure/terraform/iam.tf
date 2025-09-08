# IAM Bindings for Service Account
resource "google_project_iam_member" "storage_object_viewer" {
  project = var.project_id
  role    = "roles/storage.objectViewer"
  member  = "serviceAccount:${local.gotspot_api_email}"
}

# Firestore roles - use correct roles for project level
resource "google_project_iam_member" "firestore_admin" {
  project = var.project_id
  role    = "roles/datastore.owner"
  member  = "serviceAccount:${local.gotspot_api_email}"
}

# Additional role for Firestore access
resource "google_project_iam_member" "firestore_user" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${local.gotspot_api_email}"
}

# Cloud Run Admin role for Terraform service account
# Note: This needs to be added manually to gotspot-terraform-sa@gotspot-pilot-project.iam.gserviceaccount.com
# via GCP Console: IAM & Admin → IAM → Add role: Cloud Run Admin
