# Google Cloud

Below instructions to set up from scratch the project in Google Cloud.

Create Service Account and add Security, Cloud Run and Storage Admin and Project Owner roles. Add a key to it and download as JSON.

Enable APIs:

 - Cloud Resource Manager API
 - Cloud Build API 
 - Cloud Run API
 - Compute Engine API 
 - Google Play Android Developer API 
 - Cloud SQL Admin API
 - Secret Manager API

```
gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable secretmanager.googleapis.com
```

On IAM > Service Accounts > `PROJECT_ID-compute@developer.gserviceaccount.com` > Manage Permissions > Grant Access > Find the original service account and add Service Account User role ([SO](https://stackoverflow.com/questions/61334524/how-do-you-enable-iam-serviceaccounts-actas-permissions-on-a-sevice-account)).

Set `GOOGLE_APPLICATION_CREDENTIALS` to point to the key of the main Service Account on your computer.

In order to manage Terraform resources properly, Terraform State should be stored remotely. Set up a GCS Bucket to handle the Terraform State, and locking (for when simultaneous state changes occur). To do this we need to create one resource manually in the Google Cloud Platform Storage console. Choose CREATE BUCKET and follow the instructions. Add the bucket's name to the backend block, under bucket in [terraform/providers.tf](./services/terraform/providers.tf).

```
gsutil versioning set on gs://[BUCKET_NAME]
```

Then, from the Terraform folder:

```
docker run --rm -it \ 
	-v $(PWD):/home/terraform \
	-w /home/terraform \
	-v $GOOGLE_APPLICATION_CREDENTIALS:/home/sa.json \
	-e GOOGLE_APPLICATION_CREDENTIALS=/home/sa.json \
	hashicorp/terraform:1.0.3 \
	plan -var="dersu_api_docker_image_tag=XXXXX"
```

Uses [Cloud Run](https://cloud.google.com/run) via [cloud-run](https://registry.terraform.io/modules/garbetjie/cloud-run/google/latest) Terraform module.