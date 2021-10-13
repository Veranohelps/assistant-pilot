part of 'expeditions_cubit.dart';

abstract class RoutesState extends Equatable {
  @override
  List<Object?> get props => [];
}

class RoutesInitial extends RoutesState {}

class RoutesLoaded extends RoutesState {
  final List<DersuRouteShort> list;

  RoutesLoaded({required this.list});

  @override
  List<Object?> get props => list;
}
