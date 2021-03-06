import 'package:app/config/brand_colors.dart';
import 'package:app/config/get_it_config.dart';
import 'package:app/config/theme_typo.dart';
import 'package:flutter/material.dart';

class BrandButtons {
  static VoidCallback? analiticsOnPressWrapper(
    VoidCallback? onPressed,
    String text,
    String? label,
  ) {
    if (onPressed == null) {
      return null;
    }
    return () {
      getIt<Analitics>().sendClickEvent(action: text, label: label);
      onPressed();
    };
  }

  static Widget textButton({
    Key? key,
    required VoidCallback onPressed,
    required String text,
    String? label,
    Color? color,
  }) =>
      _BrandTextButton(
        key: key,
        onPressed: analiticsOnPressWrapper(onPressed, text, label),
        text: text,
        style: ThemeTypo.martaButtonText,
        color: color,
      );

  static Widget primaryShort({
    required String text,
    String? label,
    required VoidCallback? onPressed,
  }) =>
      _PrimaryShort(
        text: text,
        onPressed: analiticsOnPressWrapper(onPressed, text, label),
      );

  static Widget miniIconButton({
    required VoidCallback onPressed,
    required IconData icon,
    required String label,
    Color? backgroundColor,
    Color? color,
  }) =>
      TextButton(
        onPressed: analiticsOnPressWrapper(onPressed, 'icon button', label),
        style: TextButton.styleFrom(
          padding: EdgeInsets.all(5),
          minimumSize: Size(20, 20),
          backgroundColor:
              backgroundColor ?? BrandColors.buttonColor.withOpacity(0.9),
        ),
        child: Icon(
          icon,
          size: 20,
          color: color ?? BrandColors.white,
        ),
      );

  static Widget primaryBig({
    Color? color,
    required String text,
    String? label,
    required VoidCallback? onPressed,
  }) =>
      _PrimaryBig(
        color: color,
        text: text,
        onPressed: analiticsOnPressWrapper(onPressed, text, label),
      );

  static Widget primaryElevatedButton({
    required Widget child,
    required VoidCallback? onPressed,
    required String? label,
  }) =>
      ElevatedButton(
        onPressed: analiticsOnPressWrapper(onPressed, 'custom button', label),
        style: ElevatedButton.styleFrom(
          padding: EdgeInsets.fromLTRB(10, 4, 10, 6),
          minimumSize: Size.zero,
          primary: BrandColors.buttonColor,
          elevation: 0,
        ),
        child: child,
      );
}

class _PrimaryBig extends StatelessWidget {
  const _PrimaryBig({
    Key? key,
    required this.color,
    required this.text,
    required this.onPressed,
  }) : super(key: key);

  final String text;
  final VoidCallback? onPressed;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        constraints: BoxConstraints(
          minWidth: 150,
        ),
        alignment: Alignment.center,
        margin: const EdgeInsets.only(top: 2),
        padding: EdgeInsets.fromLTRB(10, 9, 10, 11),
        decoration: BoxDecoration(
          color: onPressed == null
              ? BrandColors.mGrey
              : color ?? BrandColors.primary,
          borderRadius: BorderRadius.circular(2),
        ),
        child: Text(
          text,
          style: ThemeTypo.martaButtonText,
        ).withColor(Colors.white),
      ),
    );
  }
}

class _PrimaryShort extends StatelessWidget {
  const _PrimaryShort({
    Key? key,
    required this.text,
    required this.onPressed,
  }) : super(key: key);

  final String text;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        margin: const EdgeInsets.only(top: 2),
        padding: EdgeInsets.fromLTRB(10, 4, 10, 6),
        decoration: BoxDecoration(
          color: onPressed == null ? BrandColors.mGrey : BrandColors.primary,
          borderRadius: BorderRadius.circular(2),
        ),
        child: Text(
          text,
          style: ThemeTypo.martaButtonText,
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
    this.color,
  }) : super(key: key);

  final VoidCallback? onPressed;
  final String text;
  final TextStyle style;
  final Color? color;

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
            color: color ?? BrandColors.buttonColor,
          ),
        ),
      ),
    );
  }
}
