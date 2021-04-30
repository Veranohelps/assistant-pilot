output "dersu_api_dns" {
  value = module.cloud_run.dns
}

output "dersu_api_url" {
  value = module.cloud_run.url
}

output "dersu_api_revision" {
  value = module.cloud_run.revision
}

