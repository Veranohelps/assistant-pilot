part of 'authentication_cubit.dart';

abstract class AuthenticationState extends Equatable {
  const AuthenticationState();

  @override
  List<Object> get props => [];
}

class NotAuthenticated extends AuthenticationState {}
class AuthenticationLoading extends AuthenticationState {}

class Authenticated extends AuthenticationState {
  Authenticated({
    required this.token,
  });

  final TokenResponse token;
}
