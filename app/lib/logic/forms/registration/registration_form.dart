import 'dart:async';

import 'package:app/logic/cubits/profile/profile_cubit.dart';
import 'package:app/logic/model/profile.dart';
import 'package:cubit_form/cubit_form.dart';

class RegistrationFormCubit extends FormCubit {
  RegistrationFormCubit({
    required this.profile,
    required this.profileCubit,
  }) {
    firstName = FieldCubit(
      initalValue: '',
      validations: [
        RequiredStringValidation('Required'),
      ],
    );
    lastName = FieldCubit(
      initalValue: '',
      validations: [
        RequiredStringValidation('Required'),
      ],
    );
    isSubscribedToNewsletter = FieldCubit(
      initalValue: true,
      validations: [],
    );
    addFields([
      firstName,
      lastName,
      isSubscribedToNewsletter,
    ]);
  }

  @override
  FutureOr<void> onSubmit() async {
    await profileCubit.finishRegistration(
      firstName: firstName.state.value,
      lastName: lastName.state.value,
      isSubscribedToNewsletter: isSubscribedToNewsletter.state.value,
    );
  }

  late FieldCubit<String> firstName;
  late FieldCubit<String> lastName;
  late FieldCubit<bool> isSubscribedToNewsletter;

  final Profile profile;
  final ProfileCubit profileCubit;
}
