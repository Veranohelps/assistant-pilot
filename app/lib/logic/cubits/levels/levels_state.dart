part of 'levels_cubit.dart';

abstract class LevelsState extends Equatable {
  const LevelsState();

  @override
  List<Object> get props => [];
}

class LevelsInitial extends LevelsState {}

class LevelsLoaded extends LevelsState {
  LevelsLoaded({required this.levelsMap});

  final Map<Skill, Level> levelsMap;

  factory LevelsLoaded.empty() => LevelsLoaded(levelsMap: {});

  @override
  List<Object> get props => levelsMap.values.toList();
}
