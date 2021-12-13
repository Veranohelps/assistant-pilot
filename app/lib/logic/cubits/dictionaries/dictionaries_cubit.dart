import 'package:app/logic/api_maps/dictionaries.dart';
import 'package:app/logic/cubits/authentication_dependend/authentication_dependend_cubit.dart';
import 'package:app/logic/models/activity_type.dart';
import 'package:app/logic/models/levels.dart';
import 'package:app/logic/models/route_origin.dart';
import 'package:app/logic/models/waypoint_type.dart';

part 'dictionaries_state.dart';

class DictionariesCubit
    extends AuthenticationDependendCubit<DictionariesState> {
  DictionariesCubit(AuthenticationCubit authenticationCubit)
      : super(authenticationCubit, DictionariesNotLoaded());

  final api = DictionariesApi();

  @override
  void load(token) async {
    final routeOrigins = await api.fetchRouteOrigins();
    final dictionaryLevels = await api.fetchLevelCategories();
    final activeTypes = await api.fetchActiveTypes();
    final waypointTypes = await api.fetchWaypointTypes();
    emit(
      DictionariesLoaded(
          levels: dictionaryLevels,
          routeOrigins: routeOrigins,
          activeTypes: activeTypes,
          waypointTypes: waypointTypes),
    );
  }

  @override
  void clear() {
    emit(DictionariesNotLoaded());
  }
}
