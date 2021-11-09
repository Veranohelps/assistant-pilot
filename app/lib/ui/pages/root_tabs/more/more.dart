// ignore_for_file: prefer_const_constructors

import 'package:app/generated/locale_keys.g.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:app/ui/pages/console/console.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:flutter/material.dart';

import 'about/about.dart';

class More extends StatelessWidget {
  const More({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(LocaleKeys.more_name.tr())),
      body: SafeArea(
        child: Center(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _NavItem(goTo: About(), title: LocaleKeys.more_about.tr()),
              _NavItem(goTo: Console(), title: LocaleKeys.more_console.tr())
            ],
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  const _NavItem({
    Key? key,
    required this.goTo,
    required this.title,
  }) : super(key: key);

  final Widget goTo;
  final String title;

  @override
  Widget build(BuildContext context) {
    return BrandButtons.primaryBig(
        text: title,
        onPressed: () => Navigator.of(context).push(materialRoute(goTo)));
  }
}
