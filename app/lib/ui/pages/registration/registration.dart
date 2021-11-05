// ignore_for_file: prefer_const_constructors

import 'package:app/config/brand_theme.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:app/logic/cubits/profile/profile_cubit.dart';
import 'package:app/logic/forms/registration/registration_form.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:app/ui/components/brand_switcher/brand_switcher.dart';
import 'package:app/ui/components/brand_text_field/brand_text_field.dart';
import 'package:cubit_form/cubit_form.dart';
import 'package:flutter/material.dart';
import 'package:app/utils/extensions/extensions.dart';

class Registration extends StatelessWidget {
  const Registration({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ProfileCubit, ProfileState>(
      builder: (context, state) {
        if (state is ProfileNotReady) {
          return BrandLoader();
        } else if (state is ProfileDersuRegistrationNotFinished) {
          return Scaffold(
            appBar: AppBar(title: Text(LocaleKeys.registration_name.tr())),
            body: Padding(
              padding: paddingH25V0.copyWith(top: 20),
              child: BlocProvider(
                create: (context) => RegistrationFormCubit(
                  profile: state.profile,
                  profileCubit: context.read<ProfileCubit>(),
                ),
                child: Builder(builder: (context) {
                  final form = context.watch<RegistrationFormCubit>();
                  return Column(
                    children: [
                      BrandTextField(
                        formFieldCubit: form.firstName,
                        label: LocaleKeys.registration_firstName.tr(),
                        isRequired: true,
                      ),
                      SizedBox(height: 2),
                      BrandTextField(
                        formFieldCubit: form.lastName,
                        label: LocaleKeys.registration_lastName.tr(),
                        isRequired: true,
                      ),
                      SizedBox(height: 14),
                      BlocBuilder<FieldCubit, FieldCubitState>(
                        bloc: form.isSubscribedToNewsletter,
                        builder: (_, state) {
                          return GestureDetector(
                            behavior: HitTestBehavior.opaque,
                            onTap: () => form.isSubscribedToNewsletter
                                .setValue(!state.value),
                            child: Row(
                              children: [
                                BrandSwitcher(isAcitve: state.value),
                                SizedBox(width: 10),
                                Text(
                                    LocaleKeys.registration_subscribe_text.tr())
                              ],
                            ),
                          );
                        },
                      ),
                      SizedBox(height: 14),
                      BrandButtons.primaryBig(
                          text: LocaleKeys.basis_accept.tr(),
                          onPressed: form.state.isSubmitting ||
                                  form.state.hasErrorToShow
                              ? null
                              : () => form.trySubmit())
                    ],
                  );
                }),
              ),
            ),
          );
        } else {
          throw 'wrong state';
        }
      },
    );
  }
}
