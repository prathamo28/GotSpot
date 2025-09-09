# Project configuration
variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
  default     = "europe-west1"
}

# Domain configuration
variable "domain_name" {
  description = "The domain name for the frontend"
  type        = string
  default     = "gotspot.com"
}

# GitHub configuration
variable "github_owner" {
  description = "GitHub repository owner"
  type        = string
  default     = "your-github-username"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "GotSpot"
}

# Environment configuration
variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

# CDN configuration
variable "cdn_cache_ttl" {
  description = "CDN cache TTL in seconds"
  type        = number
  default     = 3600
}

# Storage configuration
variable "storage_location" {
  description = "Storage bucket location"
  type        = string
  default     = "EU"
}
