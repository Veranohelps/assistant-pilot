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
    fontSize: 28,
    fontWeight: FontWeight.bold,
    height: 1.3,
    letterSpacing: -1.4,
  );

  static final h2 = defaultText.copyWith(
    fontSize: 24,
    fontWeight: NamedWeight.medium,
    height: 1.2,
    letterSpacing: -1.4,
  );

  static final h3 = defaultText.copyWith(
    fontSize: 20,
    fontWeight: NamedWeight.medium,
    height: 1,
    letterSpacing: -1.17,
  );
  static final h4 = defaultText.copyWith(
    fontSize: 15,
    fontWeight: NamedWeight.medium,
    height: 1.4,
    letterSpacing: -1,
  );

  static final h5 = defaultText.copyWith(
    fontSize: 12,
    fontWeight: NamedWeight.bold,
    height: 1.5,
  );

  static final h6 = defaultText.copyWith(
    fontSize: 12,
    fontWeight: NamedWeight.medium,
    height: 1.5,
  );

  static final p0 = defaultText.copyWith(
    fontSize: 14,
    height: 1.5,
  );

  static final p1 = defaultText.copyWith(
    fontSize: 12,
    height: 1.3,
  );

  static final p2 = defaultText.copyWith(
    fontSize: 10,
  );

  static final p4 = defaultText.copyWith(
    fontSize: 15,
    fontWeight: NamedWeight.regular,
    height: 1.4,
    letterSpacing: -1,
  );

  static final temp = TextStyle(color: Colors.red);
}
