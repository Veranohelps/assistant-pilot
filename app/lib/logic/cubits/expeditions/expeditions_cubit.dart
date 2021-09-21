import 'package:app/logic/api_maps/expeditions.dart';
import 'package:app/logic/cubits/authentication/authentication_cubit.dart';
import 'package:app/logic/cubits/authentication_dependend/authentication_dependend_cubit.dart';
import 'package:app/logic/model/expedition.dart';

export 'package:provider/provider.dart';

part 'expeditions_state.dart';

class ExpeditionsCubit extends AuthenticationDependendCubit<ExpeditionsState> {
  ExpeditionsCubit(AuthenticationCubit authenticationCubit)
      : super(authenticationCubit, ExpeditionsNotLoaded());

  var api = ExpeditionsApi();

  void load(_) async {
    var expeditions = await api.fetchExpeditions();
    emit(ExpeditionsLoaded(list: expeditions));
  }

  @override
  void clear() {
    emit(ExpeditionsNotLoaded());
  }
}
