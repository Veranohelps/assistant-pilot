import 'package:app/config/brand_colors.dart';
import 'package:app/config/theme_typo.dart';
import 'package:collection/collection.dart';
import 'package:cubit_form/cubit_form.dart';

import 'package:flutter/material.dart';

import 'brand_raw_label.dart';

class BrandLabel<T> extends StatelessWidget {
  const BrandLabel({
    Key? key,
    required this.text,
    required this.isRequired,
    required this.formFieldCubit,
    required this.isDisabled,
    this.emptyValue,
  }) : super(key: key);

  final String text;
  final bool isRequired;
  final bool isDisabled;
  final FieldCubit<T>? formFieldCubit;
  final T? emptyValue;

  static info() => _BrandLabelInfo();
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<FieldCubit, FieldCubitState>(
      bloc: formFieldCubit,
      builder: (context, state) {
        late bool isEmpty;
        if (emptyValue is List && state.value is List) {
          isEmpty = ListEquality().equals(state.value, emptyValue as List<dynamic>);
          return SizedBox();
        } else {
          isEmpty = state.value == emptyValue;
        }
        return BrandRawLabel(
          isEmpty: isEmpty,
          isDisabled: isDisabled,
          isRequired: isRequired,
          text: text,
        );
      },
    );
  }
}

class _BrandLabelInfo extends StatelessWidget {
  const _BrandLabelInfo({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {

    return RichText(
      text: TextSpan(
        text: 'Required fields',
        style: ThemeTypo.p0,
        children: [
          TextSpan(
            text: ' *',
            style:  ThemeTypo.p0.copyWith(color: BrandColors.red),
          ),
        ],
      ),
    );
  }
}
