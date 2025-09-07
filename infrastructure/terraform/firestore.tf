# Firestore Database
resource "google_firestore_database" "gotspot_db" {
  project     = var.project_id
  name        = "(default)"
  location_id = var.region
  type        = "FIRESTORE_NATIVE"
  depends_on  = [
    google_project_service.required_apis,
    google_project_iam_member.firestore_admin
  ]
}
