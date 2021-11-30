import 'dart:async';

import 'package:app/logic/cubits/profile/profile_cubit.dart';
import 'package:app/logic/models/profile.dart';
import 'package:cubit_form/cubit_form.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:easy_localization/easy_localization.dart';

class RegistrationFormCubit extends FormCubit {
  RegistrationFormCubit({
    required this.profile,
    required this.profileCubit,
  }) {
    firstName = FieldCubit(
      initalValue: '',
      validations: [
        RequiredStringValidation(LocaleKeys.basis_required.tr()),
      ],
    );
    lastName = FieldCubit(
      initalValue: '',
      validations: [
        RequiredStringValidation(LocaleKeys.basis_required.tr()),
      ],
    );
    isSubscribedToNewsletter = FieldCubit(
      initalValue: false,
    );
    hasReadPrivacyPolicy = FieldCubit(initalValue: false, validations: [
      RequireTrueValidation(
          LocaleKeys.registration_read_privacy_policy_error.tr())
    ]);
    hasAcceptedTermsAndConditions =
        FieldCubit(initalValue: false, validations: [
      RequireTrueValidation(
          LocaleKeys.registration_accept_terms_and_conditions_error.tr())
    ]);
    addFields([
      firstName,
      lastName,
      isSubscribedToNewsletter,
      hasReadPrivacyPolicy,
      hasAcceptedTermsAndConditions
    ]);
  }

  @override
  FutureOr<void> onSubmit() async {
    await profileCubit.finishRegistration(
        firstName: firstName.state.value,
        lastName: lastName.state.value,
        isSubscribedToNewsletter: isSubscribedToNewsletter.state.value,
        hasReadPrivacyPolicy: hasReadPrivacyPolicy.state.value,
        hasAcceptedTermsAndConditions:
            hasAcceptedTermsAndConditions.state.value);
  }

  late FieldCubit<String> firstName;
  late FieldCubit<String> lastName;
  late FieldCubit<bool> isSubscribedToNewsletter;
  late FieldCubit<bool> hasReadPrivacyPolicy;
  late FieldCubit<bool> hasAcceptedTermsAndConditions;

  final Profile profile;
  final ProfileCubit profileCubit;
}

class RequireTrueValidation extends ValidationModel<bool> {
  RequireTrueValidation(String errorText)
      : super((value) => value == false, errorText);
}
