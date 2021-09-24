# Identity and authentication

Login and registration flows happen through [Auth0](https://auth0.com/).

## Configuration

Please note that these are `develop` values, `production` values TBD.

### Mobile app

- `AUTH0_DOMAIN`: `dersu-develop.eu.auth0.com`
- `AUTH0_CLIENT_ID`: `HyowYsFA3VSJJoeWde3sKgp1qcxQ0KHn`
- `AUTH0_REDIRECT_SCHEME`: `uz.dersu.assistant.pilot`
- `AUTH0_AUDIENCE`: `dersu-develop`

### API

- `AUTH0_ISSUER_URL`: `https://dersu-develop.eu.auth0.com/`
- `AUTH0_AUDIENCE`: `dersu-develop`
- `AUTH0_TENANT`: `dersu-develop.eu`
- `AUTH0_CLIENT_ID`: `lRSRyxGj1gKcYRKq7tC3IltEWz6CSdUD`
- `AUTH0_CLIENT_SECRET`:

## Important notes:

The application uses [flutter_appauth](https://pub.dev/packages/flutter_appauth) which requires adding values to `Info.plist` for iOS and `build.gradle` for Android.

Be aware that `custom_schemes` are **different**, although it's not clear from [the package documentation](https://pub.dev/packages/flutter_appauth) and [tutorial](https://auth0.com/blog/get-started-with-flutter-authentication/).

For Android it should be `uz.dersu.assistant.pilot` (set in `AUTH0_REDIRECT_SCHEME`) and for iOS it should be `develop-login.dersu.uz`. This may be related to our use of [custom domain](https://auth0.com/docs/brand-and-customize/custom-domains) during the Auth0 flow.

Always make sure to provide an audience in order to get a valid JWT access token.
