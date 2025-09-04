# Development Environment Configuration
environment = "dev"
region = "europe-west1"
zone = "europe-west1-b"

# Resource sizing for development
cloud_run_config = {
  memory = "512Mi"
  cpu = "1"
  min_instances = 0
  max_instances = 5
  port = 8080
}

# Environment variables
environment_variables = {
  NODE_ENV = "development"
  LOG_LEVEL = "debug"
  CACHE_TTL = "300000"  # 5 minutes
}

# Security settings
security_config = {
  allow_unauthenticated = true
  enable_cors = true
  rate_limit = 100  # requests per 15 minutes
}

# Monitoring
monitoring_config = {
  enable_logging = true
  enable_monitoring = true
  log_retention_days = 7
}
