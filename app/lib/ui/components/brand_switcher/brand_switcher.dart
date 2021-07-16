import 'package:app/config/brand_colors.dart';
import 'package:flutter/material.dart';

class BrandSwitcher extends StatelessWidget {
  const BrandSwitcher({
    Key? key,
    required this.isAcitve,
  }) : super(key: key);

  final bool isAcitve;

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: Duration(milliseconds: 300),
      height: 25,
      width: 43,
      alignment: isAcitve ? Alignment.topRight : Alignment.topLeft,
      decoration: BoxDecoration(
        color: isAcitve ? BrandColors.primary : BrandColors.grey,
        borderRadius: BorderRadius.circular(17.5),
      ),
      child: Container(
        margin: EdgeInsets.all(2),
        height: 21,
        width: 21,
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              blurRadius: 8,
              offset: Offset(0, 3),
              color: Colors.black.withOpacity(0.15),
            ),
            BoxShadow(
              blurRadius: 1,
              offset: Offset(0, 3),
              color: Colors.black.withOpacity(0.06),
            )
          ],
        ),
      ),
    );
  }
}
