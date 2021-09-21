import 'package:app/logic/api_maps/dictionaries.dart';
import 'package:app/logic/cubits/authentication/authentication_cubit.dart';
import 'package:app/logic/cubits/authentication_dependend/authentication_dependend_cubit.dart';
import 'package:app/logic/model/levels.dart';

part 'dictionaries_state.dart';

class DictionariesCubit
    extends AuthenticationDependendCubit<DictionariesState> {
  DictionariesCubit(AuthenticationCubit authenticationCubit)
      : super(authenticationCubit, DictionariesNotLoaded());

  final api = DictionariesApi();

  void load(_) async {
    final categories = await api.fetchLevelCategories();
    emit(DictionariesLoaded(categories: categories));
  }

  @override
  void clear() {
    emit(DictionariesNotLoaded());
  }
}
