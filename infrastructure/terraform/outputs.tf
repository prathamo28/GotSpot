# Outputs
output "api_url" {
  description = "GotSpot API URL"
  value       = google_cloud_run_service.gotspot_api.status[0].url
}

output "firestore_database_id" {
  description = "Firestore Database ID"
  value       = google_firestore_database.gotspot_db.id
}

output "storage_bucket_name" {
  description = "Cloud Storage Bucket Name"
  value       = google_storage_bucket.gotspot_storage.name
}

output "service_account_email" {
  description = "Service Account Email"
  value       = local.gotspot_api_email
}

output "project_id" {
  description = "GCP Project ID"
  value       = var.project_id
}

output "region" {
  description = "GCP Region"
  value       = var.region
}
