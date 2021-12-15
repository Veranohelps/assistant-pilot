import 'package:app/logic/api_maps/routes.dart';
import 'package:bloc/bloc.dart';

class RouteSearchCubit extends Cubit<RouteSearchState> {
  RouteSearchCubit() : super(RouteSearchInit());

  final api = RoutesApi();

  void search(RouteSearchParameters parameters) async {
    emit(RouteSearching());
    try {
      var result = await api.search(parameters);
      emit(RouteSearchFinished(result: result, parameters: parameters));
    } catch (error) {
      emit(RouteSearchError(error: error.toString()));
    }
  }

  void reset() {
    emit(RouteSearchInit());
  }
}

class RouteSearchError extends RouteSearchState {
  final String error;

  RouteSearchError({required this.error});
}

class RouteSearchFinished extends RouteSearchState {
  final RouteSearchResults result;
  final RouteSearchParameters parameters;

  RouteSearchFinished({required this.result, required this.parameters});
}

class RouteSearching extends RouteSearchState {}

class RouteSearchInit extends RouteSearchState {}

class RouteSearchState {}
