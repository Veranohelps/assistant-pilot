import 'dart:io';

import 'package:app/logic/api_maps/user_api.dart';
import 'package:app/logic/cubits/authentication/authentication_cubit.dart';
import 'package:app/logic/cubits/authentication_dependend/authentication_dependend_cubit.dart';
import 'package:app/logic/models/profile.dart';

part 'profile_state.dart';

class ProfileCubit extends AuthenticationDependendCubit<ProfileState> {
  ProfileCubit(AuthenticationCubit authenticationCubit)
      : super(authenticationCubit, ProfileNotReady());

  final api = UserApi();

  @override
  void load(user) async {
    var profile = await api.fetch();
    late ProfileState state;
    if (profile is FilledProfile) {
      state = ProfileDersuRegistrationFinished(profile);
    } else if (profile is IncompleteProfile) {
      state = ProfileDersuRegistrationNotFinished(profile);
    }

    emit(state);
  }

  Future<void> finishRegistration({
    required String firstName,
    required bool isSubscribedToNewsletter,
    required String lastName,
  }) async {
    var updatedProfile = await api.signUp(
      firstName: firstName,
      lastName: lastName,
      isSubscribedToNewsletter: isSubscribedToNewsletter,
    );
    emit(ProfileDersuRegistrationFinished(updatedProfile));
  }

  Future<void> setProfile({
    required String firstName,
    required bool isSubscribedToNewsletter,
    required String lastName,
  }) async {
    var updatedProfile = await api.signUp(
      firstName: firstName,
      lastName: lastName,
      isSubscribedToNewsletter: isSubscribedToNewsletter,
    );
    emit(ProfileDersuRegistrationFinished(updatedProfile));
  }

  Future<void> deleteAvatar() async {
    await api.deleteAvatar();
    var newUser =
        (state as ProfileDersuRegistrationFinished).profile.deleteAvatar();
    emit(ProfileDersuRegistrationFinished(newUser));
  }

  @override
  void clear() {
    emit(ProfileNotReady());
  }

  void setNewAssessments(final Map<String, String> currentLevels) async {
    var profile = (state as ProfileDersuRegistrationFinished).profile;
    var newProfile = profile.copyWith(currentLevels: currentLevels);
    await api.setNewLevels(levels: newProfile.currentLevels.values.toList());
    emit(ProfileDersuRegistrationFinished(newProfile));
  }

  Future<void> updateAvatar(File file) async {
    var newAvatar = await api.updateAvatar(file);
    var newUser = (state as ProfileDersuRegistrationFinished)
        .profile
        .copyWith(avatar: newAvatar);
    await Future.delayed(Duration(seconds: 2));
    emit(ProfileDersuRegistrationFinished(newUser));
  }

  Future<void> updateProfile(
      {required String firstName, required String lastName}) async {
    await api.updateProfile(firstName, lastName);
    var newUser = (state as ProfileDersuRegistrationFinished).profile.copyWith(
          firstName: firstName,
          lastName: lastName,
        );
    emit(ProfileDersuRegistrationFinished(newUser));
  }

  Future<void> deleteProfile({required String message}) async {
    await api.deleteProfile(message);

    authenticationCubit.logout();
  }
}
