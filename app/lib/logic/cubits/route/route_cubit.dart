import 'package:app/logic/api_maps/routes.dart';
import 'package:app/logic/model/route.dart';
import 'package:bloc/bloc.dart';

class RouteCubit extends Cubit<DersuRoute?> {
  RouteCubit() : super(null);

  var api = RoutesApi();

  void getRoute(String id) async {
    var route = await api.fetchRoute(id);
    emit(route);
  }
}
