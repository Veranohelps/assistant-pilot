import 'package:app/config/brand_colors.dart';

import 'package:flutter/material.dart';

class BrandBottomSheet extends StatelessWidget {
  const BrandBottomSheet({
    Key? key,
    required this.child,
  }) : super(key: key);

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        SizedBox(height: 13),
        Center(
          child: Container(
            height: 5,
            width: 40,
            decoration: BoxDecoration(
              color: BrandColors.mGrey,
              borderRadius: BorderRadius.circular(5),
            ),
          ),
        ),
        SizedBox(height: 20),
        Material(
          color: BrandColors.white,
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),
            child: SafeArea(child: child),
          ),
        ),
      ],
    );
  }
}
