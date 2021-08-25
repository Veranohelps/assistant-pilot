import 'package:flutter/material.dart';

import 'brand_colors.dart';

final brandTheme = ThemeData(
    brightness: Brightness.light,
    scaffoldBackgroundColor: BrandColors.defaultScaffolBackground,
    primaryColor: BrandColors.primary,
    colorScheme: ColorScheme.fromSwatch(
      accentColor: BrandColors.secondary,
    ));

const paddingH25V0 = EdgeInsets.symmetric(horizontal: 25);

final shadow = BoxShadow(
  blurRadius: 15,
  offset: Offset(0, 4),
  color: BrandColors.black.withOpacity(0.08),
);
