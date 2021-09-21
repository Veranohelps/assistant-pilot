import 'dart:convert';

import 'package:app/logic/cubits/authentication/authentication_cubit.dart';
import 'package:app/logic/cubits/authentication_dependend/authentication_dependend_cubit.dart';

import 'package:flutter_appauth/flutter_appauth.dart';

part 'profile_state.dart';

class ProfileCubit extends AuthenticationDependendCubit<ProfileState> {
  ProfileCubit(AuthenticationCubit authenticationCubit)
      : super(authenticationCubit, ProfileNotLoaded());

  void load(TokenResponse token) {
    final parts = token.idToken!.split(r'.');
    assert(parts.length == 3);

    var auth0UserInfo = jsonDecode(
      utf8.decode(
        base64Url.decode(base64Url.normalize(parts[1])),
      ),
    );
    print(auth0UserInfo);
    emit(
      ProfileLoaded(
          email: auth0UserInfo?['name'], name: auth0UserInfo?['nickname']),
    );
  }

  @override
  void clear() {}
}
