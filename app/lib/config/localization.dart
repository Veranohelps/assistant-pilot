import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';

class Localization extends StatelessWidget {
  const Localization({
    Key? key,
    required this.child,
  }) : super(key: key);

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return EasyLocalization(
      supportedLocales: [Locale('en', 'US'), Locale('es', 'ES')],
      path: 'assets/translations',
      fallbackLocale: Locale('en', 'US'),
      saveLocale: false,
      child: child,
      useFallbackTranslations: true,
    );
  }
}
