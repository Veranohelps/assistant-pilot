import 'package:app/config/brand_theme.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:app/logic/cubits/dashboard/dashboard_cubit.dart';
import 'package:app/logic/cubits/select_activity_types/select_activity_types_cubit.dart';
import 'package:app/logic/cubits/select_time/select_time.dart';
import 'package:app/logic/forms/create_expedition/create_expedition.dart';
import 'package:app/logic/models/route.dart';
import 'package:app/ui/components/brand_text_field/brand_text_field.dart';
import 'package:cubit_form/cubit_form.dart';
import 'package:flutter/material.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:easy_localization/easy_localization.dart';

class CreatePlanning extends StatelessWidget {
  const CreatePlanning({
    Key? key,
    required this.route,
    required this.startTime,
  }) : super(key: key);

  final DersuRouteFull route;
  final DateTime startTime;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(LocaleKeys.planning_confirm_expedition.tr())),
      body: Padding(
        padding: paddingH25V0.copyWith(top: 20),
        child: BlocProvider(
          create: (context) => CreateExpeditionFormCubit(
            startTime: startTime,
            route: route,
            dashboardCubit: context.read<DashboardCubit>(),
            selectTimeCubit: context.read<SelectTimeCubit>(),
            selectActivityTypesCubit: context.read<SelectActivityTypesCubit>(),
          ),
          child: Builder(builder: (context) {
            final form = context.watch<CreateExpeditionFormCubit>();
            return BlocListener<CreateExpeditionFormCubit, FormCubitState>(
              listener: (context, state) {
                if (state.isSubmitted) {
                  Navigator.of(context)
                    ..pop()
                    ..pop();
                }
              },
              child: Column(
                children: [
                  BrandTextField(
                    formFieldCubit: form.name,
                    label: LocaleKeys.planning_confirm_expedition_name.tr(),
                    isRequired: true,
                  ),
                  SizedBox(height: 10),
                  BrandTextField(
                    formFieldCubit: form.descrption,
                    label:
                        LocaleKeys.planning_confirm_expedition_description.tr(),
                    isRequired: false,
                  ),
                  SizedBox(height: 14),
                  BrandButtons.primaryBig(
                      text: LocaleKeys.planning_confirm_save_expedition.tr(),
                      onPressed:
                          form.state.isSubmitting || form.state.hasErrorToShow
                              ? null
                              : () => form.trySubmit())
                ],
              ),
            );
          }),
        ),
      ),
    );
  }
}
