import 'package:app/config/get_it_config.dart';
import 'package:app/logic/cubits/authentication/repository.dart';
import 'package:app/logic/get_it/auth_token.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter_appauth/flutter_appauth.dart';
export 'package:provider/provider.dart';

part 'authentication_state.dart';

class AuthenticationCubit extends Cubit<AuthenticationState> {
  AuthenticationCubit() : super(NotAuthenticated());

  final repository = AuthenticationRepository();

  void load() async {
    var res = await repository.load();
    var newState = res.fold(
      () => NotAuthenticated(),
      (token) {
        getIt<Analitics>().sendCubitEvent(action: 'Cubit: Silent login');
        getIt<AuthTokenService>().tokenResponse = token;
        return Authenticated(token: token);
      },
    );

    emit(newState);
  }

  void login() async {
    emit(AuthenticationLoading());
    var res = await repository.login();
    var newState = res.fold(
      () => NotAuthenticated(),
      (token) {
        getIt<Analitics>().sendCubitEvent(
            action: 'Cubit: Registration or login with credentials');
        getIt<AuthTokenService>().tokenResponse = token;
        return Authenticated(token: token);
      },
    );

    emit(newState);
  }

  void logout() async {
    getIt<AuthTokenService>().tokenResponse = null;
    await repository.logout();
    getIt<Analitics>().sendCubitEvent(action: 'Cubit: Logout');
    emit(NotAuthenticated());
  }
}
