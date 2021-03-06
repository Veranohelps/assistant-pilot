import 'package:app/logic/api_maps/routes.dart';
import 'package:app/logic/models/route.dart';
import 'package:bloc/bloc.dart';

class RouteCubit extends Cubit<DersuRouteFull?> {
  RouteCubit() : super(null);

  var api = RoutesApi();

  void getRoute(String url) async {
    var route = await api.route(url);
    emit(route);
  }
}
