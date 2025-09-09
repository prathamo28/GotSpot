# Frontend URL
output "frontend_url" {
  description = "The URL of the frontend"
  value       = "https://${google_compute_global_address.frontend.address}"
}

# Storage bucket name
output "storage_bucket_name" {
  description = "The name of the storage bucket"
  value       = google_storage_bucket.frontend.name
}

# Storage bucket URL
output "storage_bucket_url" {
  description = "The URL of the storage bucket"
  value       = "https://storage.googleapis.com/${google_storage_bucket.frontend.name}"
}

# IP address
output "ip_address" {
  description = "The global IP address"
  value       = google_compute_global_address.frontend.address
}

# Cloud Build trigger will be created manually after GitHub setup

# SSL certificate name
output "ssl_certificate_name" {
  description = "The name of the SSL certificate"
  value       = google_compute_managed_ssl_certificate.frontend.name
}
