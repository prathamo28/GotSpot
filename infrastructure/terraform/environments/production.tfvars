# Production Environment Configuration
environment = "production"
region = "europe-west1"
zone = "europe-west1-b"

# Resource sizing for production
cloud_run_config = {
  memory = "4Gi"
  cpu = "4"
  min_instances = 5
  max_instances = 100
  port = 8080
}

# Environment variables
environment_variables = {
  NODE_ENV = "production"
  LOG_LEVEL = "warn"
  CACHE_TTL = "1800000"  # 30 minutes
}

# Security settings
security_config = {
  allow_unauthenticated = true
  enable_cors = true
  rate_limit = 1000  # requests per 15 minutes
}

# Monitoring
monitoring_config = {
  enable_logging = true
  enable_monitoring = true
  log_retention_days = 90
}
