terraform {
  required_version = "~> 1.0.3"

  backend "gcs" {
    bucket = "dersu-assistant--pilot-terraform-state"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

data "google_client_config" "default" {
}
