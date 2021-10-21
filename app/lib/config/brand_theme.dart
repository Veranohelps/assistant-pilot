import 'package:flutter/material.dart';

import 'brand_colors.dart';

final brandTheme = ThemeData(
  brightness: Brightness.light,
  scaffoldBackgroundColor: BrandColors.defaultScaffolBackground,
  primaryColor: BrandColors.primary,
  colorScheme: ColorScheme.fromSwatch(
    accentColor: BrandColors.secondary,
  ),
  appBarTheme: AppBarTheme(
    backgroundColor: BrandColors.primary,
  ),
  sliderTheme: SliderThemeData(
    valueIndicatorColor: BrandColors.primary,
    inactiveTrackColor: BrandColors.lGray,
    activeTrackColor: BrandColors.lGray,
    thumbColor: BrandColors.primary,
  ),
);

const paddingH25V0 = EdgeInsets.symmetric(horizontal: 25);

final shadow = BoxShadow(
  blurRadius: 15,
  offset: Offset(0, 4),
  color: BrandColors.black.withOpacity(0.08),
);
