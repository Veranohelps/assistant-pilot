# Dersu Content

## Strapi

[Strapi](https://strapi.io/) instances are environment specific, for example:

- https://develop-cms.dersu.uz
- https://production-cms.dersu.uz

### Dersu API to Strapi authentication

In order for the Dersu API to access Strapi content we use [authenticated requests](https://strapi.io/documentation/developer-docs/latest/guides/auth-request.html). 

Create in Strapi a regular user for the Dersu API (not admin user) and use those credentials for the Dersu API to get a valid token in order to make the requests that get content out of Strapi.

Creating the Dersu API user needs to be done manually for every environment, including locally. 