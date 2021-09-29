part of 'profile_cubit.dart';

abstract class ProfileState extends AuthenticationDependendState {
  @override
  List<Object> get props => [];
}

class ProfileNotReady extends ProfileState {}

abstract class ProfileReady extends ProfileState {
  abstract final Profile profile;

  @override
  List<Object> get props => [profile];
}

class ProfileDersuRegistrationNotFinished extends ProfileReady {
  ProfileDersuRegistrationNotFinished(this.profile);

  final IncompleteProfile profile;
}

class ProfileDersuRegistrationFinished extends ProfileReady {
  ProfileDersuRegistrationFinished(this.profile);

  final FilledProfile profile;

  @override
  List<Object> get props => [profile];
}
