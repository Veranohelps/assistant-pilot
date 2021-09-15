# Dersu Assistant Pilot

## Configuration

Read the [mobile app](./app) and [web services](./services) documentation.

## Infrastructure

Dersu's infrastructure and [environments](./docs/environments.md) are hosted in [Google Cloud](./docs/gcp.md).

## CI and CD

Implemented through [Github Actions](https://github.com/dersu-uz/assistant-pilot/actions).

### Mobile application

- Run tests on commits to any branch.
- Build and deploy to Google Play's alpha branch on commits to `develop`.

### Web services

- Run tests on commits to any branch.
- Build, push and deploy API via Terraform on commits to `develop` and `production`.

The following **repository** secrets required:

 - `GCP_PROJECT_ID`, `GCP_SA_KEY` (actual content of the service account key) and `GCP_EMAIL` (used for the service account).
 - `IOS_MAPS_API_KEY`, `ANDROID_MAPS_API_KEY` ([Google Maps Flutter](https://pub.dev/packages/google_maps_flutter)), `ANDROID_STORE_PASSWORD`, `ANDROID_JKS` (actual contents of the key file B64 encoded), `ANDROID_KEY_PASSWORD`, `ANDROID_KEY_ALIAS` (as required to sign Android Releases with Flutter), `TRANSISTOR_BG_LOCATOR_KEY`.
