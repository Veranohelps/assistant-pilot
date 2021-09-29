output "api_docker_image" {
  value = google_cloud_run_service.api.template[0].spec[0].containers[0].image
}

output "api_cloud_run_url" {
  value = google_cloud_run_service.api.status[0].url
}

output "api_dersu_url" {
  value = google_cloud_run_domain_mapping.api.name
}

output "strapi_docker_image" {
  value = google_cloud_run_service.strapi.template[0].spec[0].containers[0].image
}

output "strapi_cloud_run_url" {
  value = google_cloud_run_service.strapi.status[0].url
}

output "strapi_url" {
  value = google_cloud_run_domain_mapping.strapi.name
}

output "admin_console_docker_image" {
  value = google_cloud_run_service.admin-console.template[0].spec[0].containers[0].image
}

output "admin_console_cloud_run_url" {
  value = google_cloud_run_service.admin-console.status[0].url
}

output "admin_console_dersu_url" {
  value = google_cloud_run_domain_mapping.admin-console.name
}

output "db_instance_name" {
  value = google_sql_database_instance.instance.name
}
