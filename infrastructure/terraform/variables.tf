variable "project_id" {
  description = "GCP Project ID"
  type        = string
  default     = "gotspot-pilot-project"
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "europe-west1"
}

variable "zone" {
  description = "GCP Zone"
  type        = string
  default     = "europe-west1-b"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "google_maps_api_key" {
  description = "Google Maps API Key"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT Secret for authentication"
  type        = string
  sensitive   = true
  default     = "your-jwt-secret-here"
}

variable "github_owner" {
  description = "GitHub repository owner"
  type        = string
  default     = "prathamo28"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "GotSpot"
}

variable "cloud_run_config" {
  description = "Cloud Run configuration"
  type = object({
    memory         = string
    cpu            = string
    min_instances  = number
    max_instances  = number
    port           = number
  })
  default = {
    memory         = "512Mi"
    cpu            = "1"
    min_instances  = 0
    max_instances  = 5
    port           = 8080
  }
}

variable "environment_variables" {
  description = "Environment variables for Cloud Run"
  type = map(string)
  default = {
    NODE_ENV   = "development"
    LOG_LEVEL  = "debug"
    CACHE_TTL  = "300000"
  }
}

variable "security_config" {
  description = "Security configuration"
  type = object({
    allow_unauthenticated = bool
    enable_cors          = bool
    rate_limit           = number
  })
  default = {
    allow_unauthenticated = true
    enable_cors          = true
    rate_limit           = 100
  }
}

variable "monitoring_config" {
  description = "Monitoring configuration"
  type = object({
    enable_logging      = bool
    enable_monitoring   = bool
    log_retention_days  = number
  })
  default = {
    enable_logging      = true
    enable_monitoring   = true
    log_retention_days  = 7
  }
}
