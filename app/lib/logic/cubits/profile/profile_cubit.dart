import 'package:app/logic/api_maps/user_api.dart';
import 'package:app/logic/cubits/authentication/authentication_cubit.dart';
import 'package:app/logic/cubits/authentication_dependend/authentication_dependend_cubit.dart';
import 'package:app/logic/model/profile.dart';

import 'package:flutter_appauth/flutter_appauth.dart';

part 'profile_state.dart';

class ProfileCubit extends AuthenticationDependendCubit<ProfileState> {
  ProfileCubit(AuthenticationCubit authenticationCubit)
      : super(authenticationCubit, ProfileNotReady());

  final api = UserApi();

  void load(TokenResponse token) async {
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

  Future<void> set({
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
}
