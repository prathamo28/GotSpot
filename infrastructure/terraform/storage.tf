# Cloud Storage Bucket - Use fixed name to prevent multiple buckets
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

  lifecycle_rule {
    condition {
      age = 7
    }
    action {
      type = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }
}
