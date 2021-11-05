import 'package:app/config/brand_colors.dart';
import 'package:app/config/theme_typo.dart';
import 'package:flutter/material.dart';

class BrandRawLabel extends StatelessWidget {
  const BrandRawLabel({
    Key? key,
    required this.isEmpty,
    required this.isDisabled,
    required this.isRequired,
    required this.text,
  }) : super(key: key);

  final bool isEmpty;
  final bool isDisabled;
  final bool isRequired;
  final String text;

  @override
  Widget build(BuildContext context) {
    Color labelColor;
    if (isDisabled) {
      labelColor = BrandColors.black;
    } else {
      labelColor = isEmpty ? BrandColors.black : BrandColors.mGrey;
    }
    return Container(
      padding: EdgeInsets.only(bottom: 6),
      child: RichText(
        text: TextSpan(
          text: text,
          style: ThemeTypo.p0.copyWith(color: labelColor),
          children: [
            if (isRequired && !isDisabled)
              TextSpan(
                text: ' *',
                style: ThemeTypo.p0.copyWith(
                    color: isEmpty ? BrandColors.red : BrandColors.mGrey),
                children: const [],
              ),
          ],
        ),
      ),
    );
  }
}
