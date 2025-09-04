# UAT Environment Configuration
environment = "uat"
region = "europe-west1"
zone = "europe-west1-b"

# Resource sizing for UAT
cloud_run_config = {
  memory = "1Gi"
  cpu = "2"
  min_instances = 1
  max_instances = 10
  port = 8080
}

# Environment variables
environment_variables = {
  NODE_ENV = "uat"
  LOG_LEVEL = "info"
  CACHE_TTL = "600000"  # 10 minutes
}

# Security settings
security_config = {
  allow_unauthenticated = true
  enable_cors = true
  rate_limit = 200  # requests per 15 minutes
}

# Monitoring
monitoring_config = {
  enable_logging = true
  enable_monitoring = true
  log_retention_days = 14
}
