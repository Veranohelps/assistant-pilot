import 'package:app/config/brand_colors.dart';
import 'package:app/config/brand_theme.dart';
import 'package:flutter/material.dart';

class BrandCard extends StatelessWidget {
  const BrandCard({
    Key? key,
    required this.child,
  }) : super(key: key);

  final Widget child;
  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          shadow,
        ],
        color: BrandColors.white,
      ),
      padding: EdgeInsets.symmetric(vertical: 10, horizontal: 20),
      child: child,
    );
  }
}
