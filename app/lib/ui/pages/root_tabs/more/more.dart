// ignore_for_file: prefer_const_constructors

import 'package:app/config/brand_colors.dart';
import 'package:app/config/theme_typo.dart';
import 'package:app/ui/components/brand_system_overlay/brand_system_overlay.dart';
import 'package:app/ui/pages/console/console.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:flutter/material.dart';

import 'about/about.dart';

class More extends StatelessWidget {
  const More({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BrandSystemOverlay(
      isFontBlack: true,
      child: Scaffold(
        body: SafeArea(
          child: Column(
            children: [
              SizedBox(height: 40),
              Text(
                'More',
                style: ThemeTypo.h1,
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 20),
              Spacer(),
              Container(
                decoration: BoxDecoration(
                  color: BrandColors.dGray,
                  borderRadius: BorderRadius.circular(20),
                ),
                margin: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: const [
                    _NavItem(
                      title: 'Acerca de',
                      goTo: About(),
                    ),
                    _NavItem(
                      title: 'Console',
                      goTo: Console(),
                    ),
                  ],
                ),
              ),
              Spacer(flex: 5),
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
    return GestureDetector(
      onTap: () => Navigator.of(context).push(materialRoute(goTo)),
      child: Container(
        margin: EdgeInsets.symmetric(horizontal: 20),
        decoration: BoxDecoration(
          border: Border(
            bottom: BorderSide(
              color: BrandColors.mGrey,
              width: 1,
            ),
          ),
        ),
        padding: EdgeInsets.symmetric(
          vertical: 24,
          horizontal: 20,
        ),
        child: Text(
          title,
          style: ThemeTypo.p0.copyWith(color: BrandColors.white),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }
}
