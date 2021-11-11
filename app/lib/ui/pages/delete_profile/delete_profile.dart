import 'package:app/config/brand_colors.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:app/logic/cubits/authentication/authentication_cubit.dart';
import 'package:app/logic/cubits/profile/profile_cubit.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:app/ui/components/brand_text_field/brand_text_field.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class DeleteProfilePAge extends StatefulWidget {
  const DeleteProfilePAge({Key? key}) : super(key: key);

  @override
  State<DeleteProfilePAge> createState() => _DeleteProfilePAgeState();
}

class _DeleteProfilePAgeState extends State<DeleteProfilePAge> {
  String message = '';

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthenticationCubit, AuthenticationState>(
      listener: (context, state) {
        if (state is NotAuthenticated) {
          Navigator.of(context).popUntil((route) => route.isFirst);
        }
      },
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: BrandColors.red,
          title: Text(
            LocaleKeys.profile_delete_profile.tr(),
          ),
        ),
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                LocaleKeys.profile_delete_profile_text.tr(),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 20),
              SizedBox(
                width: 300,
                child: TextField(
                  onChanged: (t) => message = t,
                  minLines: 4,
                  maxLines: 4,
                  maxLength: 200,
                  textAlign: TextAlign.left,
                  decoration: defaultInputDecoration.copyWith(
                      labelText:
                          LocaleKeys.profile_delete_profile_text_hint.tr(),
                      alignLabelWithHint: true,
                      floatingLabelBehavior: FloatingLabelBehavior.never,
                      floatingLabelStyle: TextStyle()),
                ),
              ),
              SizedBox(height: 20),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  BrandButtons.primaryBig(
                    text: LocaleKeys.basis_cancel.tr(),
                    onPressed: () => {Navigator.of(context).pop()},
                  ),
                  SizedBox(width: 20),
                  BrandButtons.primaryBig(
                    color: BrandColors.red,
                    text: LocaleKeys.profile_delete_profile_confirmation.tr(),
                    onPressed: () => context
                        .read<ProfileCubit>()
                        .deleteProfile(message: message),
                  ),
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
