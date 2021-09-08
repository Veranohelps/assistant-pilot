import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';

class Localization extends StatelessWidget {
  const Localization({
    Key? key,
    required this.builder,
  }) : super(key: key);

  final Widget Function(BuildContext) builder;

  @override
  Widget build(BuildContext context) {
    return EasyLocalization(
      supportedLocales: [Locale('es'), Locale('en')],
      path: 'assets/translations',
      fallbackLocale: Locale('en'),
      saveLocale: false,
      useOnlyLangCode: true,
      child: Builder(builder: builder),
    );
  }
}
