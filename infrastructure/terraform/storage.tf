# Random ID for unique resource names
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# Cloud Storage Bucket
resource "google_storage_bucket" "gotspot_storage" {
  name          = "${var.project_id}-gotspot-storage-${random_id.bucket_suffix.hex}"
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
