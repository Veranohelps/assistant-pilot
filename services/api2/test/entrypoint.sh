#!/bin/sh

printf "\n\n======================================\n"
printf "Run migrations"
printf "\n======================================\n\n"
yarn migrations

printf "\n\n======================================\n"
printf "Running tests"
printf "\n======================================\n\n"
export NODE_ENV=test
yarn test
