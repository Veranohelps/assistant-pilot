# Dersu Assistant Pilot

## Configuration

Read the [mobile app](./app) and [web services](./services) documentation.

## Infrastructure

Dersu's infrastructure and [environments](./docs/environments.md) are hosted in [Google Cloud](./docs/gcp.md).

## CI and CD

Implemented through [Github Actions](https://github.com/dersu-uz/assistant-pilot/actions).

### Mobile application

- Run tests on commits to any branch.
- For releases read [mobile app README instructions](./app).

### Web services

- Run tests on commits to any branch.
- Build, push and deploy API via Terraform on commits to `develop` and `production`.

The following **repository** secrets required:

 - `GCP_PROJECT_ID`, `GCP_SA_KEY` (actual content of the service account key) and `GCP_EMAIL` (used for the service account).
