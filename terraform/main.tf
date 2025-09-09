# Configure the Google Cloud Provider
terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
  
  # Configure remote state backend
  backend "gcs" {
    bucket = "gotspot-terraform-state"
    prefix = "frontend/state"
  }
}

# Configure the Google Cloud Provider
provider "google" {
  project = var.project_id
  region  = var.region
}

# Create a random suffix for unique resource names
resource "random_id" "suffix" {
  byte_length = 4
}

# Create Cloud Storage bucket for frontend
resource "google_storage_bucket" "frontend" {
  name          = "gotspot-frontend-${random_id.suffix.hex}"
  location      = var.region
  force_destroy = true

  # Enable versioning
  versioning {
    enabled = true
  }

  # Configure lifecycle rules
  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type = "Delete"
    }
  }

  # Configure CORS for web access
  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD", "OPTIONS"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  # Configure website
  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }
}

# Make the bucket public
resource "google_storage_bucket_iam_member" "public" {
  bucket = google_storage_bucket.frontend.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# Create Cloud CDN backend bucket
resource "google_compute_backend_bucket" "frontend" {
  name        = "gotspot-frontend-backend-${random_id.suffix.hex}"
  bucket_name = google_storage_bucket.frontend.name
  enable_cdn  = true

  cdn_policy {
    cache_mode                   = "CACHE_ALL_STATIC"
    default_ttl                  = 3600
    client_ttl                   = 3600
    max_ttl                      = 86400
    negative_caching             = true
    serve_while_stale            = 86400
    request_coalescing           = true
  }
}

# Create URL map
resource "google_compute_url_map" "frontend" {
  name            = "gotspot-frontend-map-${random_id.suffix.hex}"
  default_service = google_compute_backend_bucket.frontend.id
}

# Create HTTPS proxy
resource "google_compute_target_https_proxy" "frontend" {
  name             = "gotspot-frontend-https-proxy-${random_id.suffix.hex}"
  url_map          = google_compute_url_map.frontend.id
  ssl_certificates = [google_compute_managed_ssl_certificate.frontend.id]
}

# Create managed SSL certificate
resource "google_compute_managed_ssl_certificate" "frontend" {
  name = "gotspot-frontend-ssl-cert-${random_id.suffix.hex}"

  managed {
    domains = [var.domain_name]
  }
}

# Create global forwarding rule
resource "google_compute_global_forwarding_rule" "frontend" {
  name       = "gotspot-frontend-forwarding-rule-${random_id.suffix.hex}"
  target     = google_compute_target_https_proxy.frontend.id
  port_range = "443"
  ip_address = google_compute_global_address.frontend.address
}

# Reserve global IP address
resource "google_compute_global_address" "frontend" {
  name = "gotspot-frontend-ip-${random_id.suffix.hex}"
}

# Cloud Build trigger will be created manually after GitHub setup
