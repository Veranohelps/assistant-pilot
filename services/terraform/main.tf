module cloud_run {
  source              = "garbetjie/cloud-run/google"
  name                = "dersu-assistant-api"
  image               = "gcr.io/dersu-assistant/api:${var.dersu_api_docker_image_tag}"
  location            = "europe-west1"
  # map_domains         = ["api.dersu.uz"]
  allow_public_access = true
  port                = 3000
}
