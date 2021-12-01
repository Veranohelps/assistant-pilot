import 'dart:async';

import 'package:app/logic/cubits/authentication/authentication_cubit.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter_appauth/flutter_appauth.dart';
export 'package:app/logic/cubits/authentication/authentication_cubit.dart';

part 'authentication_dependend_state.dart';

abstract class AuthenticationDependendCubit<
    T extends AuthenticationDependendState> extends Cubit<T> {
  AuthenticationDependendCubit(
    this.authenticationCubit,
    T initState,
  ) : super(initState) {
    authCubitSubscription = authenticationCubit.stream.listen(checkAuthStatus);
    checkAuthStatus(authenticationCubit.state);
  }

  void checkAuthStatus(AuthenticationState state) {
    if (state is Authenticated) {
      load(state.token);
    } else if (state is NotAuthenticated) {
      clear();
    }
  }

  late StreamSubscription authCubitSubscription;
  final AuthenticationCubit authenticationCubit;

  void load(TokenResponse token);
  void clear();

  @override
  Future<void> close() {
    authCubitSubscription.cancel();
    return super.close();
  }
}
