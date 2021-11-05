import 'package:app/config/brand_colors.dart';
import 'package:app/config/theme_typo.dart';
import 'package:app/ui/components/brand_hint_text/brand_hint_text.dart';
import 'package:app/ui/components/brand_label/brand_label.dart';
import 'package:cubit_form/cubit_form.dart';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';

class BrandTextField extends StatelessWidget {
  const BrandTextField({
    Key? key,
    required this.formFieldCubit,
    required this.label,
    this.helperText,
    this.obscureText = false,
    this.maskFormatter,
    this.keyboardType,
    this.isRequired = false,
    this.isDisabled = false,
    this.prefix,
    this.maxLines = 1,
    this.autofocus = false,
  }) : super(key: key);

  final FieldCubit<String?>? formFieldCubit;
  final bool obscureText;
  final bool isRequired;
  final bool isDisabled;
  final int maxLines;

  final Widget? prefix;

  final String label;
  final String? helperText;

  final TextInputType? keyboardType;
  final MaskTextInputFormatter? maskFormatter;
  final bool autofocus;

  @override
  Widget build(BuildContext context) {
    Widget field = maskFormatter == null ? normalField() : maskFormtedField();

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        BrandLabel(
          text: label,
          formFieldCubit: formFieldCubit,
          isRequired: isRequired,
          isDisabled: isDisabled,
          emptyValue: '',
        ),
        SizedBox(height: 2),
        field,
        if (helperText != null)
          HintText(
            text: helperText!,
            formFieldCubit: formFieldCubit!,
          ),
      ],
    );
  }

  Widget maskFormtedField() {
    return CubitFormMaskedTextField(
      autofocus: autofocus,
      formFieldCubit: formFieldCubit as FieldCubit<String>,
      cursorColor: BrandColors.mGrey,
      maskFormatter: maskFormatter!,
      style: TextStyle(fontSize: 16, height: 1.2),
      keyboardType: keyboardType,
      decoration: defaultInputDecoration.copyWith(
        prefix: prefix,
      ),
    );
  }

  Widget normalField() {
    return CubitFormTextField(
      autofocus: autofocus,
      formFieldCubit: formFieldCubit as FieldCubit<String>,
      obscureText: obscureText,
      cursorColor: BrandColors.mGrey,
      style: TextStyle(fontSize: 16, height: 1.2),
      keyboardType: keyboardType,
      maxLines: maxLines,
      decoration: defaultInputDecoration.copyWith(
        prefix: prefix,
      ),
    );
  }
}

final errorBorder = OutlineInputBorder(
  borderSide: BorderSide(color: BrandColors.red),
  borderRadius: BorderRadius.circular(12),
);

var defaultInputDecoration = InputDecoration(
  errorStyle: ThemeTypo.p0.copyWith(
    color: BrandColors.red,
  ),
  focusedErrorBorder: errorBorder,
  errorBorder: errorBorder,
  helperStyle: ThemeTypo.p0.copyWith(
    color: BrandColors.mGrey,
  ),
  focusedBorder: OutlineInputBorder(
    borderSide: BorderSide(color: BrandColors.primary),
    borderRadius: BorderRadius.circular(12),
  ),
  enabledBorder: OutlineInputBorder(
    borderSide: BorderSide(color: BrandColors.mGrey),
    borderRadius: BorderRadius.circular(12),
  ),
  contentPadding: EdgeInsets.symmetric(vertical: 11.5, horizontal: 12),
  isDense: true,
  filled: true,
  // fillColor: BrandColors.w,
);
