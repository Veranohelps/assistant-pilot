import 'package:app/logic/api_maps/routes.dart';
import 'package:app/logic/models/route.dart';
import 'package:bloc/bloc.dart';

class UserRoutesCubit extends Cubit<UserRoutesState> {
  UserRoutesCubit() : super(UserRoutesNotLoaded());

  var api = RoutesApi();

  void load() async {
    var routes = await api.userRoutes();
    emit(UserRoutesLoaded(routes: routes));
  }

  void reload() async {
    emit(UserRoutesNotLoaded());
    load();
  }
}

class UserRoutesLoaded extends UserRoutesState {
  final List<DersuRouteShort> routes;

  UserRoutesLoaded({required this.routes});
}

class UserRoutesNotLoaded extends UserRoutesState {}

class UserRoutesState {}
