terraform {
  required_version = "1.1.0"

  backend "gcs" {
    bucket = "dersu-assistant--pilot-terraform-state"
    prefix = "terraform/state"
  }
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

data "google_client_config" "default" {
}
