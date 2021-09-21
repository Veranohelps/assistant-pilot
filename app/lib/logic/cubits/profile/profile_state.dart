part of 'profile_cubit.dart';

abstract class ProfileState extends AuthenticationDependendState {
  const ProfileState();

  @override
  List<Object> get props => [];
}

class ProfileNotLoaded extends ProfileState {}

class ProfileLoaded extends ProfileState {
  ProfileLoaded({
    required this.name,
    required this.email,
  });

  final String name;
  final String email;

  @override
  List<Object> get props => [name, email];
}
