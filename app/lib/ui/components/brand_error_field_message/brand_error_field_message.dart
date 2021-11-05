import 'package:app/config/brand_colors.dart';
import 'package:app/config/theme_typo.dart';

import 'package:flutter/material.dart';

class BrandErrorFieldMessage extends StatelessWidget {
  const BrandErrorFieldMessage({
    Key? key,
    required this.hasError,
    required this.error,
  }) : super(key: key);

  final String? error;
  final bool hasError;
  @override
  Widget build(BuildContext context) {
    if (hasError && error != null) {
      return Padding(
        padding: const EdgeInsets.all(8.0),
        child: Text(
          error!,
          style: ThemeTypo.p0.copyWith(color: BrandColors.errors),
        ),
      );
    }

    return Container();
  }
}
