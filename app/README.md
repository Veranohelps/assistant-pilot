# Dersu Assistant mobile app

The Dersu Assistant app is built using [Flutter](https://flutter.dev/) for both Android and iOS.

## Development

You have to get the configuration file and Android signing key from GCP's Secret Manager. You can do so manually or running the following commands (requires `gcloud` installed and initialised and being able to access the project in GCP, including Secret Manager Secret Accessor role):

```
gcloud secrets versions access 3 --secret="develop-app-configuration" > app/.env
gcloud secrets versions access 2 --secret="develop-app-android-jks" > app/android/app/sign/android-key.b64
base64 -d app/android/app/sign/android-key.b64 > app/android/app/sign/android-key.jks
flutter pub get
flutter run
```

Check the main [README](../readme.md) for more info.

Packages, libraries and plugins in use:

- [Bloc](https://bloclibrary.dev) for state management.
- [getIt](https://github.com/fluttercommunity/get_it) as a service locator.
- [Hive DB](https://docs.hivedb.dev) NoSql key-value database written in Dart.
- [flutter_appauth](https://pub.dev/packages/flutter_appauth) A Flutter bridge for AppAuth. 

## Misc

LocaleKeys generation: 
`$ flutter pub run easy_localization:generate --source-dir ./assets/translations -f keys -o locale_keys.g.dart`

Also see notes about [Auth0 configuration](../docs/identity.md).