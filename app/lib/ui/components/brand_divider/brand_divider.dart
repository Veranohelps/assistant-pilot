import 'package:flutter/material.dart';

class BrandDivider extends StatelessWidget {
  const BrandDivider({
    Key? key,
    this.margin,
    this.color,
    this.height,
  }) : super(key: key);

  final EdgeInsets? margin;
  final Color? color;
  final double? height;

  @override
  Widget build(BuildContext context) {
    var divider = Container(
      margin: margin,
      height: 1,
      color: color ?? Color(0xFF212121).withOpacity(0.08),
    );

    return height != null
        ? Padding(
            padding: EdgeInsets.symmetric(vertical: height! / 2),
            child: divider,
          )
        : divider;
  }
}
