import 'dart:ui';

import 'package:url_launcher/url_launcher.dart';
import 'package:flutter_config/flutter_config.dart';

class ExternalUrls {
  static void launchPrivacyPolicy(Locale locale) async {
    final baseUrl = FlutterConfig.get('DERSU_SITE_BASE_URL');
    final fullUrl = (locale.languageCode == "es")
        ? '$baseUrl/es/privacidad'
        : '$baseUrl/en/privacy';

    if (await canLaunch(fullUrl)) {
      await launch(fullUrl);
    } else {
      throw 'Could not launch $fullUrl';
    }
  }

  static void launchTermsAndConditions(Locale locale) async {
    final baseUrl = FlutterConfig.get('DERSU_SITE_BASE_URL');
    final fullUrl = (locale.languageCode == "es")
        ? '$baseUrl/es/condiciones-de-uso'
        : '$baseUrl/en/terms-and-conditions';

    if (await canLaunch(fullUrl)) {
      await launch(fullUrl);
    } else {
      throw 'Could not launch $fullUrl';
    }
  }
}
