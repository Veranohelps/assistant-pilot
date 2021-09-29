#!/bin/zsh
docker run --rm -it \
	-v $(PWD):/home/terraform \
	-w /home/terraform \
	-v $GOOGLE_APPLICATION_CREDENTIALS:/home/sa.json \
	-e GOOGLE_APPLICATION_CREDENTIALS=/home/sa.json \
	-e TF_VAR_STRAPI_PASSWORD=$TF_VAR_STRAPI_PASSWORD \
	-e TF_VAR_STRAPI_EMAIL=$TF_VAR_STRAPI_EMAIL \
	hashicorp/terraform:1.0.3 \
	apply \
	-var="dersu_strapi_docker_image_tag=juan-b8c7d93" \
	-var="dersu_api_docker_image_tag=admin-apis-ecc92c5" \
	-var="dersu_admin_console_docker_image_tag=admin-apis-ecc92c5" \
