import 'package:app/logic/api_maps/routes.dart';
import 'package:app/logic/cubits/authentication/authentication_cubit.dart';
import 'package:app/logic/cubits/authentication_dependend/authentication_dependend_cubit.dart';
import 'package:app/logic/model/route.dart';

export 'package:provider/provider.dart';

part 'expeditions_state.dart';

class RoutesCubit extends AuthenticationDependendCubit<RoutesState> {
  RoutesCubit(AuthenticationCubit authenticationCubit)
      : super(authenticationCubit, RoutesNotLoaded());

  var api = RoutesApi();

  void load(_) async {
    var routes = await api.routes();
    emit(RoutesLoaded(list: routes));
  }

  @override
  void clear() {
    emit(RoutesNotLoaded());
  }
}
