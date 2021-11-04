import 'dart:async';

import 'package:app/logic/cubits/profile/profile_cubit.dart';
import 'package:app/logic/models/profile.dart';
import 'package:cubit_form/cubit_form.dart';

class ProfileEditFormCubit extends FormCubit {
  ProfileEditFormCubit({
    required this.profile,
    required this.profileCubit,
  }) {
    firstName = FieldCubit(
      initalValue: profile.firstName,
      validations: [
        RequiredStringValidation('Required'),
      ],
    );
    lastName = FieldCubit(
      initalValue: profile.lastName,
      validations: [
        RequiredStringValidation('Required'),
      ],
    );

    addFields([
      firstName,
      lastName,
    ]);
  }

  @override
  FutureOr<void> onSubmit() async {
    await profileCubit.updateProfile(
      firstName: firstName.state.value,
      lastName: lastName.state.value,
    );
  }

  late FieldCubit<String> firstName;
  late FieldCubit<String> lastName;

  final FilledProfile profile;
  final ProfileCubit profileCubit;
}
