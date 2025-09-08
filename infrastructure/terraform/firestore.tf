# Firestore Database - Use existing database
# Note: Firestore default database already exists, so we'll reference it
locals {
  firestore_database_id = "projects/${var.project_id}/databases/(default)"
}
