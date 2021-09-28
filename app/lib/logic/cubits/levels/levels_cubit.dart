import 'package:app/logic/api_maps/levels_api.dart';
import 'package:app/logic/cubits/authentication/authentication_cubit.dart';
import 'package:app/logic/cubits/authentication_dependend/authentication_dependend_cubit.dart';
import 'package:app/logic/model/levels.dart';

export 'package:provider/provider.dart';

part 'levels_state.dart';

class LevelsCubit extends AuthenticationDependendCubit<LevelsState> {
  LevelsCubit(AuthenticationCubit authenticationCubit)
      : super(authenticationCubit, LevelsNotReady());

  final api = LevelsApi();

  void load(_) async {
    var res = await api.fetch();
    emit(LevelsLoaded(levelsMap: res));
  }

  void setLevel({
    required String skillId,
    required String levelId,
  }) {
    final newLevelsMap = <String, String>{};
    if (state is LevelsLoaded) {
      newLevelsMap.addAll((state as LevelsLoaded).levelsMap);
    }
    newLevelsMap[skillId] = levelId;
    api.update(newLevelsMap);
    emit(LevelsLoaded(levelsMap: newLevelsMap));
  }

  @override
  void clear() {
    emit(LevelsNotReady());
  }
}
