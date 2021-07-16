part of 'expeditions_cubit.dart';

abstract class ExpeditionsState extends Equatable {}

class ExpeditionsInitial extends ExpeditionsState {
  @override
  List<Object?> get props => [];
}

class ExpeditionsLoaded extends ExpeditionsState {
  final List<Expedition> list;

  ExpeditionsLoaded({required this.list});

  @override
  List<Object?> get props => list;
}
