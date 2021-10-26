import 'package:app/config/brand_colors.dart';
import 'package:app/ui/components/brand_error_field_message/brand_error_field_message.dart';
import 'package:flutter/material.dart';

class BrandFakeInput extends StatelessWidget {
  const BrandFakeInput({
    Key? key,
    required this.hasError,
    this.onPress,
    required this.intputText,
    this.error,
    this.placeholder,
    this.sufix,
  }) : super(key: key);

  final bool hasError;
  final VoidCallback? onPress;
  final String? intputText;
  final String? error;
  final String? placeholder;

  final Widget? sufix;

  @override
  Widget build(BuildContext context) {
    bool isPlaceHolderShown = intputText == null && placeholder != null;
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        GestureDetector(
          onTap: onPress,
          child: Container(
            height: 44,
            padding: EdgeInsets.symmetric(vertical: 11.5, horizontal: 12),
            decoration: BoxDecoration(
              border: Border.all(
                color: hasError ? BrandColors.errors : BrandColors.mGrey,
              ),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    isPlaceHolderShown ? placeholder! : intputText ?? '',
                    style: TextStyle(fontSize: 16, height: 1.2).copyWith(
                        color: isPlaceHolderShown
                            ? BrandColors.dGray
                            : BrandColors.black),
                  ),
                ),
                if (sufix != null) sufix!,
              ],
            ),
          ),
        ),
        BrandErrorFieldMessage(hasError: hasError, error: error),
      ],
    );
  }
}
