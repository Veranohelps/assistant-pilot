terraform {
  required_version = "~> 0.14.10"

  # backend "gcs" {
  #   bucket = "fst-terraform-bucket"
  #   prefix = "terraform/state"
  # }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

data "google_client_config" "default" {
}
