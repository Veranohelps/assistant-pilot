part of 'user_search_cubit.dart';

abstract class UserSearchState {}

class UserSearchInitial extends UserSearchState {}

class UserSearchLoading extends UserSearchState {}

class UserSearchLoaded extends UserSearchState {
  UserSearchLoaded({
    required this.users,
  });

  final List<User> users;
}

class UserSearchEmpty extends UserSearchState {}

class UserSearchError extends UserSearchState {}
