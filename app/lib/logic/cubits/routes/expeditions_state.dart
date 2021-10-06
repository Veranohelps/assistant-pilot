part of 'expeditions_cubit.dart';

abstract class RoutesState extends AuthenticationDependendState {}

class RoutesNotLoaded extends RoutesState {
  @override
  List<Object?> get props => [];
}

class RoutesLoaded extends RoutesState {
  final List<DersuRouteShort> list;

  RoutesLoaded({required this.list});

  @override
  List<Object?> get props => list;
}
