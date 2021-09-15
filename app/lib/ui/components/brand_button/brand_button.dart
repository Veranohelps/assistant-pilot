import 'package:app/config/brand_colors.dart';
import 'package:app/config/theme_typo.dart';
import 'package:flutter/material.dart';

Widget textButton({
  Key? key,
  required VoidCallback onPressed,
  required String text,
  Color? color,
}) =>
    _BrandTextButton(
      key: key,
      onPressed: onPressed,
      text: text,
      style: ThemeTypo.p4,
      padding: const EdgeInsets.symmetric(horizontal: 5),
      color: color,
    );

Widget primaryShort({
  required String text,
  required VoidCallback onPressed,
}) =>
    _PrimaryShort(
      text: text,
      onPressed: onPressed,
    );

class _PrimaryShort extends StatelessWidget {
  const _PrimaryShort({
    Key? key,
    required this.text,
    required this.onPressed,
  }) : super(key: key);

  final String text;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        margin: const EdgeInsets.only(top: 2),
        padding: EdgeInsets.fromLTRB(10, 4, 10, 6),
        decoration: BoxDecoration(
          color: BrandColors.primary,
          borderRadius: BorderRadius.circular(2),
        ),
        child: Text(
          text,
          style: ThemeTypo.p4,
        ).withColor(Colors.white),
      ),
    );
  }
}

class _BrandTextButton extends StatelessWidget {
  const _BrandTextButton({
    Key? key,
    required this.onPressed,
    required this.text,
    required this.style,
    required this.padding,
    Color? color,
  })  : this.color = color ?? BrandColors.active,
        super(key: key);

  final VoidCallback onPressed;
  final String text;
  final TextStyle style;
  final EdgeInsets padding;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 2),
      child: TextButton(
        onPressed: onPressed,
        style: TextButton.styleFrom(
          padding: EdgeInsets.fromLTRB(10, 4, 10, 6),
          minimumSize: Size.zero,
        ),
        child: Text(
          text,
          style: style.copyWith(
            color: color,
          ),
        ),
      ),
    );
  }
}
