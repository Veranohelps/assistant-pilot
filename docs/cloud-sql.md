# Cloud SQL

## How to connect locally

- Make sure you have a valid installation of the `gcloud` CLI, including going through the [`gcloud init`](https://cloud.google.com/sdk/gcloud/reference/init) process.
- Download and install [Cloud SQL Auth proxy](https://cloud.google.com/sql/docs/mysql/sql-proxy).
- Run `./cloud_sql_proxy -instances INSTANCE_CONNECTION_NAME=tcp:5432`, you can find the connection name in the [Cloud SQL console](https://console.cloud.google.com/sql).
- Open your database management tool of choice and use:
  - `127.0.0.1` as the host and `5432` as the port.
  -  `dersu-database`, and `dersu-database-user`.
  -  You can find the password in [Secrets Manager console](https://console.cloud.google.com/security/secret-manager).

References and troubleshooting:

- [gcloud init](https://cloud.google.com/sdk/gcloud/reference/init).
- [About the Cloud SQL Auth proxy](https://cloud.google.com/sql/docs/mysql/sql-proxy).
- [Quickstart for using the Cloud SQL Auth proxy](https://cloud.google.com/sql/docs/mysql/quickstart-proxy-test).