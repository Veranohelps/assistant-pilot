
############## SERVICES

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
        volume_mounts {
          name = "configuration"
          mount_path = "/home/dersu-api/secrets"
        }
        ports {
          container_port = 3033
        }
      }
      volumes {
        name = "configuration"
        secret {
          secret_name = google_secret_manager_secret.api-configuration-secret.secret_id
          items {
            key = data.google_secret_manager_secret_version.api-configuration-version.version
            path = ".env"
          }
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

resource "google_secret_manager_secret" "api-configuration-secret" {
  project = var.project_id
  secret_id = "${terraform.workspace}-api-configuration"

  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "api-configuration" {
  secret = google_secret_manager_secret.api-configuration-secret.name
  secret_data = <<EOT
NODE_ENV="production"
APP_PORT=3033
APP_URL="http://localhost:3033"
DB_HOST="/cloudsql/${google_sql_database_instance.instance.connection_name}"
DB_USER="${google_sql_user.user.name}"
DB_PASSWORD="${random_password.database-password.result}"
DB_DATABASE="${google_sql_database.database.name}"
AUTH0_ISSUER_URL="https://dersu-develop.eu.auth0.com/"
AUTH0_AUDIENCE="dersu-develop"
AUTH0_TENANT="dersu-develop.eu"
AUTH0_CLIENT_ID="lRSRyxGj1gKcYRKq7tC3IltEWz6CSdUD"
AUTH0_CLIENT_SECRET="${data.google_secret_manager_secret_version.auth0-client-secret-version.secret_data}"
API_ADMIN_TOKEN="${random_password.api-admin-token.result}"
METEOBLUE_API_KEY="${data.google_secret_manager_secret_version.meteoblue-apikey-version.secret_data}"
EOT
}

# NOTE (JD): This data resource has an explicit dependency on the secret version
# resource so it waits for it to be created in order to get the latest version by number (not "latest")
# Ideally the resource would expose `version`, but it does not!!
data "google_secret_manager_secret_version" "api-configuration-version" {
  secret = google_secret_manager_secret.api-configuration-secret.name
  depends_on = [google_secret_manager_secret_version.api-configuration]
}

data "google_secret_manager_secret_version" "auth0-client-secret-version" {
  secret = "${terraform.workspace}-auth0-client-secret"
  project = var.project_id
  version = 1
}

data "google_secret_manager_secret_version" "meteoblue-apikey-version" {
  secret = "${terraform.workspace}-meteoblue-apikey"
  project = var.project_id
  version = 1
}
