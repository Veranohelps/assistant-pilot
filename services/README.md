# Dersu web services

## API

The API service provides APIs for the Dersu ecosystem.

The API is available as `ENVIRONMENT-api.dersu.uz`:

- https://develop-api.dersu.uz
- https://production-api.dersu.uz

The temporary single API token is available at GCP Secret Manager as `ENVIRONMENT-api-admin-token`.

### Configuration

The API takes its configuration from a file placed at `secrets/.env`. Configuration files are environment specific and are managed through Terraform and stored in GCP Secret Manager.

To get the local configuration file you can manually download it from the GCP console or run:

```
gcloud secrets versions access 1 --secret="local-api-configuration" > services/api2/secrets/.env
```

Changing the configuration in a backwards compatible manner **requires** adding a whole new `google_secret_manager_secret_version` resource in order to avoid the deletion of the current version. If backwards compatibility is not required and / or downtime is acceptable you can update the current resource "in place". This is due to default Terraform behaviour, more information in [google_secret_manager_secret_version destroys secrets when replacing](https://github.com/hashicorp/terraform-provider-google/issues/8653).


The above means that "evolving" configuration without downtime is a 2 step process. In step 1 a new configuration version with the new values or structure is explicitly added to Terraform. And in step 2 once the new code and configuration are fully deployed and no live services rely on the previous version of the configuration, then the previous configuration resource is removed from Terraform (and hence GCP Secrets). 

## Admin Console

The Admin console serves as custom CMS for some of Dersu's needs.

The Admin console is available as `ENVIRONMENT-admin-console.dersu.uz`:

- https://develop-admin-console.dersu.uz
- https://production-admin-console.dersu.uz
