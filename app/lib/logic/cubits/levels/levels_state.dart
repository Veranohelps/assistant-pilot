part of 'levels_cubit.dart';

abstract class LevelsState extends AuthenticationDependendState {
  const LevelsState();

  @override
  List<Object> get props => [];
}

class LevelsNotReady extends LevelsState {}

class LevelsLoaded extends LevelsState {
  LevelsLoaded({required this.levelsMap});

  final Map<String, String> levelsMap;

  factory LevelsLoaded.empty() => LevelsLoaded(levelsMap: {});

  @override
  List<Object> get props => levelsMap.values.toList();

  Level? levelById(Skill skill) {
    var id = levelsMap[skill.id];
    if (id == null) {
      return null;
    }
    return skill.children.firstWhere((element) => element.id == id);
  }
}
