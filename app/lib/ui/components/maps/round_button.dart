import 'package:app/config/brand_colors.dart';
import 'package:flutter/material.dart';

class RoundButton extends StatelessWidget {
  const RoundButton({
    Key? key,
    required this.icon,
    required this.onPress,
  }) : super(key: key);

  final IconData icon;
  final VoidCallback onPress;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onPress,
      child: Container(
        height: 56,
        width: 56,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: BrandColors.white,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              blurRadius: 16,
              offset: Offset(0, 16),
              color: BrandColors.marta3F464C.withOpacity(0.25),
            ),
          ],
        ),
        child: Icon(
          icon,
          size: 24,
          color: BrandColors.darkGreen,
        ),
      ),
    );
  }
}
