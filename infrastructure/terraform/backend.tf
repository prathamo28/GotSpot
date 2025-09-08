# Terraform Backend Configuration
terraform {
  backend "gcs" {
    bucket = "gotspot-terraform-state"
    prefix = "terraform/state"
  }
}
