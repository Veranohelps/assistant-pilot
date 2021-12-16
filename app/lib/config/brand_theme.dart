import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';

import 'brand_colors.dart';

final brandTheme = ThemeData(
  brightness: Brightness.light,
  scaffoldBackgroundColor: BrandColors.defaultScaffolBackground,
  primaryColor: BrandColors.primary,
  colorScheme: const ColorScheme.light(
      primary: BrandColors.primary,
      onPrimary: BrandColors.white,
      onSurface: BrandColors.primary // body text color
      ),
  appBarTheme: const AppBarTheme(
    backgroundColor: BrandColors.primary,
  ),
  sliderTheme: const SliderThemeData(
    valueIndicatorColor: BrandColors.primary,
    inactiveTrackColor: BrandColors.lGray,
    activeTrackColor: BrandColors.lGray,
    thumbColor: BrandColors.primary,
  ),
  textButtonTheme: TextButtonThemeData(
    style: TextButton.styleFrom(
      primary: Colors.black, // button text color
    ),
  ),
  // tabBarTheme: TabBarTheme(
  //   indicator: UnderlineTabIndicator(
  //     borderSide: BorderSide(
  //       color: BrandColors.active,
  //       width: 2,
  //     ),
  //   ),
  // ),
);

const paddingH25V0 = EdgeInsets.symmetric(horizontal: 25);

final shadow = BoxShadow(
  blurRadius: 15,
  offset: const Offset(0, 4),
  color: BrandColors.black.withOpacity(0.08),
);

MarkdownStyleSheet markdownStyle = MarkdownStyleSheet(
    h1: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
    h2: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
    p: TextStyle(fontSize: 14));
