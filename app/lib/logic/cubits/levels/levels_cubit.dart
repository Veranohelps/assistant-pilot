import 'package:app/logic/model/levels.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
export 'package:provider/provider.dart';

part 'levels_state.dart';

class LevelsCubit extends Cubit<LevelsState> {
  LevelsCubit() : super(LevelsLoaded.empty());

  void setLevel({
    required Skill skill,
    required Level level,
  }) {
    final newLevelsMap = <Skill, Level>{};
    if (state is LevelsLoaded) {
      newLevelsMap.addAll((state as LevelsLoaded).levelsMap);
    }
    newLevelsMap[skill] = level;
    emit(LevelsLoaded(levelsMap: newLevelsMap));
  }
}
