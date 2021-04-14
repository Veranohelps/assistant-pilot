# Dersu Assistant Pilot!

## Configuration

 - App:
 	- `ANDROID_SDK_GEO_MAPS_KEY`: see [Google Maps Flutter](https://pub.dev/packages/google_maps_flutter) reference.
 	- `DERSU_API_BASE_URL`
 - API:
 	- `PORT`
 - Terraform:
 	- `GOOGLE_APPLICATION_CREDENTIALS`

## GCP

Create Service Account and add Security, Cloud Run and Storage Admin and Project Owner roles. Add a key to it and download as JSON.

Enable APIs:

 - Cloud Resource Manager API
 - Cloud Build API 
 - Cloud Run API
 - Compute Engine API 

```
gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable compute.googleapis.com
```

On IAM > Service Accounts > `PROJECT_ID-compute@developer.gserviceaccount.com` > Manage Permissions > Grant Access > Find the original service account and add Service Account User role ([SO](https://stackoverflow.com/questions/61334524/how-do-you-enable-iam-serviceaccounts-actas-permissions-on-a-sevice-account)).

Set `GOOGLE_APPLICATION_CREDENTIALS` to point to the key of the main Service Account on your computer.

Then, from the Terraform folder:

```
docker run --rm -it -v $(PWD):/home/terraform -w /home/terraform -v $GOOGLE_APPLICATION_CREDENTIALS:/home/sa.json -e GOOGLE_APPLICATION_CREDENTIALS=/home/sa.json hashicorp/terraform:light plan
```

Uses [Cloud Run](https://cloud.google.com/run) via [cloud-run](https://registry.terraform.io/modules/garbetjie/cloud-run/google/latest) Terraform module.