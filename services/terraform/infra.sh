#!/bin/zsh
docker run --rm -it \
	-v $(PWD):/home/terraform \
	-w /home/terraform \
	-v $GOOGLE_APPLICATION_CREDENTIALS:/home/sa.json \
	-e GOOGLE_APPLICATION_CREDENTIALS=/home/sa.json \
	hashicorp/terraform:1.0.3 \
	destroy \
	-var="dersu_api_docker_image_tag=admin-apis-ecc92c5" \
	-var="dersu_admin_console_docker_image_tag=admin-apis-ecc92c5" \
