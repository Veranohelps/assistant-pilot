import 'package:app/config/brand_colors.dart';
import 'package:app/config/theme_typo.dart';
import 'package:cubit_form/cubit_form.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';


class HintText extends StatelessWidget {
  const HintText({
    Key? key,
    required this.text,
    required this.formFieldCubit,
  }) : super(key: key);
  final String text;
  final FieldCubit formFieldCubit;

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<FieldCubit, FieldCubitState>(
        bloc: formFieldCubit,
        builder: (context, state) {
          var hidden = state.isErrorShown && !state.isValid;
          return hidden
              ? Container()
              : Text(
                  text,
                  style: ThemeTypo.p4.copyWith(
                    color: BrandColors.mGrey,
                  ),
                );
        });
  }
}
