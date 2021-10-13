import 'package:app/logic/api_maps/routes.dart';
import 'package:app/logic/models/route.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

export 'package:provider/provider.dart';

part 'expeditions_state.dart';

class RoutesCubit extends Cubit<RoutesState> {
  RoutesCubit() : super(RoutesInitial());

  var api = RoutesApi();

  void load() async {
    var routes = await api.routes();
    emit(RoutesLoaded(list: routes));
  }
}
