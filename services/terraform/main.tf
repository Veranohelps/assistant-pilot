module cloud_run {
  source              = "garbetjie/cloud-run/google"
  name                = "dersu-assistant-api"
  image               = "gcr.io/dersu-assistant/helloworld"
  location            = "europe-west2"
  allow_public_access = true
  port                = 3000
}
