# GotSpot Terraform Infrastructure

This directory contains the Terraform configuration for the GotSpot application infrastructure on Google Cloud Platform.

## File Structure

```
infrastructure/terraform/
├── main.tf              # Provider configuration and core setup
├── variables.tf         # Input variables
├── environments/        # Environment-specific variable files
│   ├── dev.tfvars
│   ├── uat.tfvars
│   ├── pre-prod.tfvars
│   └── prod.tfvars
├── apis.tf             # Google Cloud APIs and service accounts
├── iam.tf              # IAM roles and permissions
├── firestore.tf        # Firestore database configuration
├── storage.tf          # Cloud Storage buckets
├── cloudrun.tf         # Cloud Run service configuration
├── outputs.tf          # Output values
└── README.md           # This file
```

## Resource Organization

### `main.tf`
- Provider configuration
- Terraform version requirements
- Core setup

### `apis.tf`
- Google Cloud APIs enablement
- Service account data source
- Local variables

### `iam.tf`
- IAM role bindings
- Service account permissions
- Access control

### `firestore.tf`
- Firestore database configuration
- Database settings and dependencies

### `storage.tf`
- Cloud Storage bucket configuration
- Lifecycle rules
- Random ID generation

### `cloudrun.tf`
- Cloud Run service definition
- Container configuration
- IAM policies for public access

### `outputs.tf`
- Output values for other modules
- Important resource identifiers

## Usage

### Deploy to Development
```bash
terraform plan -var-file="environments/dev.tfvars"
terraform apply -var-file="environments/dev.tfvars"
```

### Deploy to Production
```bash
terraform plan -var-file="environments/prod.tfvars"
terraform apply -var-file="environments/prod.tfvars"
```

## Environment Files

Each environment has its own `.tfvars` file with environment-specific values:
- `dev.tfvars` - Development environment
- `uat.tfvars` - User Acceptance Testing
- `pre-prod.tfvars` - Pre-production
- `prod.tfvars` - Production

## Dependencies

- Google Cloud Project with billing enabled
- Service account with appropriate permissions
- Terraform >= 1.0
- Google Cloud CLI configured
