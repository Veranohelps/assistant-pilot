# Dersu Assistant mobile app

The Dersu Assistant app is built using [Flutter](https://flutter.dev/) for both Android and iOS.

## Development

1. Copy `.env.example` to `.env`, fill in the details (`TRANSISTOR_BG_LOCATOR_KEY` is not required for debug builds). 
2. Run `flutter pub get` and `flutter run`.


If you need to locally build an APK:

1. Run `keytool -genkey -v -keystore ~/key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias key`
2. Setup relevant Android variables into your `.env` file.
3. Run `flutter build apk`.

Check the main [README](../readme.md) for more info.

Packages, libraries and plugins in use:

- [Bloc](https://bloclibrary.dev) for state management.
- [getIt](https://github.com/fluttercommunity/get_it) as a service locator.
- [Hive DB](https://docs.hivedb.dev) NoSql key-value database written in Dart.

## Misc

LocaleKeys generation: 
`$ flutter pub run easy_localization:generate --source-dir ./assets/translations -f keys -o locale_keys.g.dart`