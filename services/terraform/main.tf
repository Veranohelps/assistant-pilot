
############## SERVICES

#  LEGACY
module cloud_run {
  source   = "garbetjie/cloud-run/google"
  name     = "dersu-assistant-api-${terraform.workspace}"
  image    = "gcr.io/dersu-assistant/api:develop-3550400c"
  location = "europe-west1"
  # map_domains         = ["api.dersu.uz"]
  allow_public_access = true
  port                = 3000
  project = var.project_id
}

resource "google_cloud_run_service" "api" {
  project = var.project_id
  provider = google-beta
  name     = "${terraform.workspace}-dersu-assistant-api"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/dersu-assistant/api:${var.dersu_api_docker_image_tag}"
        # resources {
        #   limits = {
        #     cpu = "2000m"
        #     memory = "1024Mi"
        #   }
        # }
        env {
          name = "APP_PORT"
          value = 3033
        }
        env {
          name = "APP_URL"
          value = "https://${terraform.workspace}-api.dersu.uz"
        }
        env {
          name = "NODE_ENV"
          value = "production"
        }
        env {
          name = "DB_HOST"
          value = "/cloudsql/${google_sql_database_instance.instance.connection_name}"
        }
        env {
          name = "DB_USER"
          value = google_sql_user.user.name
        }
        env {
          name = "DB_PASSWORD"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.db-password-secret.secret_id
              key = "latest"
            }
          }
        }
        env {
          name = "DB_DATABASE"
          value = google_sql_database.database.name
        }
        env {
          name = "API_ADMIN_TOKEN"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.api-admin-token-secret.secret_id
              key = "latest"
            }
          }
        }
        ports {
          container_port = 3033
        }
      }
    }
    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale"      = "1"
        "autoscaling.knative.dev/maxScale"      = "1000"
        "run.googleapis.com/cloudsql-instances" = google_sql_database_instance.instance.connection_name
        "run.googleapis.com/client-name"        = "terraform"
      }
    }
  }

  metadata {
    annotations = {
      generated-by = "magic-modules"
      "run.googleapis.com/launch-stage" = "BETA"
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  lifecycle {
    ignore_changes = [
        metadata.0.annotations,
    ]
  }  
}

resource "google_cloud_run_domain_mapping" "api" {
  provider   = google-beta
  location   = var.region
  name       = "${terraform.workspace}-api.dersu.uz"

  metadata {
    annotations = {
      generated-by = "magic-modules"
      "run.googleapis.com/launch-stage" = "BETA"
    }    
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_service.api.name
  }

  lifecycle {
    ignore_changes = [
        metadata.0.annotations,
    ]
  }  
}

resource "google_cloud_run_domain_mapping" "admin-console" {
  provider   = google-beta
  location   = var.region
  name       = "${terraform.workspace}-admin-console.dersu.uz"

  metadata {
    annotations = {
      generated-by = "magic-modules"
      "run.googleapis.com/launch-stage" = "BETA"
    }    
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_service.admin-console.name
  }

  lifecycle {
    ignore_changes = [
        metadata.0.annotations,
    ]
  }  
}

resource "google_cloud_run_service" "admin-console" {
  project = var.project_id
  provider = google-beta
  name     = "${terraform.workspace}-dersu-assistant-admin-console"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/dersu-assistant/admin-console:${var.dersu_admin_console_docker_image_tag}"
        # resources {
        #   limits = {
        #     cpu = "2000m"
        #     memory = "1024Mi"
        #   }
        # }
        ports {
          container_port = 3000
        }
      }
    }
    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale"      = "1"
        "autoscaling.knative.dev/maxScale"      = "1000"
      }
    }
  }
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth-api" {
  location    = google_cloud_run_service.api.location
  project     = google_cloud_run_service.api.project
  service     = google_cloud_run_service.api.name

  policy_data = data.google_iam_policy.noauth.policy_data
}

resource "google_cloud_run_service_iam_policy" "noauth-admin-console" {
  location    = google_cloud_run_service.admin-console.location
  project     = google_cloud_run_service.admin-console.project
  service     = google_cloud_run_service.admin-console.name

  policy_data = data.google_iam_policy.noauth.policy_data
}

############## DATABASE

resource "random_id" "db_name_suffix" {
  byte_length = 5
}

resource "google_sql_database_instance" "instance" {
  project = var.project_id
  name   = "${terraform.workspace}-database-instance-${random_id.db_name_suffix.hex}"
  region = var.region
  database_version = "POSTGRES_13"
  settings {
    tier = "db-f1-micro"
  }

  deletion_protection  = "false"
}

resource "google_sql_user" "user" {
  project = var.project_id
  name     = "dersu-database-user"
  instance = google_sql_database_instance.instance.name
  password = random_password.database-password.result
  depends_on = [google_sql_database_instance.instance]
}

resource "google_sql_database" "database" {
  project = var.project_id
  name     = "dersu-database"
  instance = google_sql_database_instance.instance.name
  depends_on = [google_sql_database_instance.instance]
}

############## SECRETS

resource "random_password" "database-password" {
  length           = 25
  special          = true
}

resource "google_secret_manager_secret" "db-password-secret" {
  project = var.project_id
  secret_id = "${terraform.workspace}-db-password"

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "db-password" {
  secret = google_secret_manager_secret.db-password-secret.name
  secret_data = random_password.database-password.result
}

resource "random_password" "api-admin-token" {
  length           = 25
  special          = true
}

resource "google_secret_manager_secret" "api-admin-token-secret" {
  project = var.project_id
  secret_id = "${terraform.workspace}-api-admin-token"

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "api-admin-token" {
  secret = google_secret_manager_secret.api-admin-token-secret.name
  secret_data = random_password.api-admin-token.result
}
