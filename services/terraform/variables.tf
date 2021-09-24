variable "project_id" {
  type    = string
  default = "dersu-assistant"
}

variable "region" {
  type    = string
  # Domain Mapping are not available in all locations
  # See: https://cloud.google.com/run/docs/mapping-custom-domains  
  default = "europe-west1"
}

variable "dersu_api_docker_image_tag" {
  type = string
}

variable "dersu_admin_console_docker_image_tag" {
  type = string
}

variable "AUTH0_CLIENT_SECRET" {
  type = string
}