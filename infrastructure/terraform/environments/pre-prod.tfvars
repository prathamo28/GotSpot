# Pre-Production Environment Configuration
environment = "pre-prod"
region = "europe-west1"
zone = "europe-west1-b"

# Resource sizing for pre-production
cloud_run_config = {
  memory = "2Gi"
  cpu = "2"
  min_instances = 2
  max_instances = 20
  port = 8080
}

# Environment variables
environment_variables = {
  NODE_ENV = "pre-prod"
  LOG_LEVEL = "info"
  CACHE_TTL = "900000"  # 15 minutes
}

# Security settings
security_config = {
  allow_unauthenticated = true
  enable_cors = true
  rate_limit = 500  # requests per 15 minutes
}

# Monitoring
monitoring_config = {
  enable_logging = true
  enable_monitoring = true
  log_retention_days = 30
}
