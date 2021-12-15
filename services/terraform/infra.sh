#!/bin/zsh
docker run --rm -it \
	-v $(PWD):/home/terraform \
	-w /home/terraform \
	-v $GOOGLE_APPLICATION_CREDENTIALS:/home/sa.json \
	-e GOOGLE_APPLICATION_CREDENTIALS=/home/sa.json \
	hashicorp/terraform:1.1.0 \
	plan \
	-var="dersu_api_docker_image_tag=develop-421001c" \
	-var="dersu_admin_console_docker_image_tag=develop-421001c"
