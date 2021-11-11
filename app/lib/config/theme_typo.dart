import 'package:app/utils/named_font_weight.dart';
import 'package:flutter/material.dart';
import 'brand_colors.dart';
export 'package:app/utils/extensions/text_extension.dart';

class ThemeTypo {
  static const defaultText = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.normal,
    height: 1.2,
    color: BrandColors.text,
  );

  static final h1 = defaultText.copyWith(
    fontSize: 34,
    fontWeight: NamedWeight.bold,
    height: 1.2,
    color: BrandColors.text,
    letterSpacing: -34 / 100 * 2,
  );

  static final h2 = defaultText.copyWith(
    fontSize: 20,
    fontWeight: NamedWeight.bold,
    height: 1.2,
    letterSpacing: -20 / 100 * 2,
  );

  static final p0 = defaultText.copyWith(
    fontSize: 13,
    height: 1.2,
  );

  static final overline = defaultText.copyWith(
    fontSize: 10,
    fontWeight: NamedWeight.medium,
    height: 16 / 10,
    letterSpacing: 1.5,
  );

  static final martaButtonText = defaultText.copyWith(
    fontSize: 14,
    height: 16 / 14,
    letterSpacing: 1.25,
  );

  static final martaTab = defaultText.copyWith(
    fontSize: 14,
    height: 16 / 14,
    fontWeight: NamedWeight.medium,
    letterSpacing: 1.25,
  );

  static final subtitle2 = TextStyle(
    fontSize: 14,
    fontWeight: NamedWeight.medium,
    height: 24 / 14,
    letterSpacing: 0.1,
    color: BrandColors.darkGreen,
  );

  static const temp = TextStyle(color: Colors.red);
}

class MType {
  static const h5 = TextStyle(
    fontSize: 24,
    height: 24 / 24,
    letterSpacing: 0.18,
  );

  static const h6 = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w500,
    height: 24 / 20,
    letterSpacing: 0.15,
  );

  static const subtitle1 = TextStyle(
    fontSize: 16,
    height: 24 / 16,
    letterSpacing: 0.15,
  );

  static const overline = TextStyle(
    fontSize: 10,
    height: 16 / 10,
    letterSpacing: 1.15,
    fontWeight: FontWeight.w500,
  );
}
