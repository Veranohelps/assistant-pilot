import 'package:app/config/brand_colors.dart';
import 'package:app/ui/components/brand_icons/dersu_icons_icons.dart';
import 'package:flutter/material.dart';

class BrandLoader extends StatelessWidget {
  const BrandLoader({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Material(
      child: Center(
        child: Icon(
          DersuIcons.logo,
          size: 100,
          color: BrandColors.mGrey,
        ),
      ),
    );
  }
}
