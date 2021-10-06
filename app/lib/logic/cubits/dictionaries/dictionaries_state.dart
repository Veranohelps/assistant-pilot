part of 'dictionaries_cubit.dart';

abstract class DictionariesState extends AuthenticationDependendState {
  const DictionariesState();

  @override
  List<Object> get props => [];
}

class DictionariesNotLoaded extends DictionariesState {}

class DictionariesLoaded extends DictionariesState {
  final List<Category> dictionaryLevels;
  final List<RouteOrigin> routeOrigins;

  bool get isNotEmtpy => props.isNotEmpty;
  bool get isEmpty => props.isEmpty;

  DictionariesLoaded({
    required this.dictionaryLevels,
    required this.routeOrigins,
  });

  RouteOrigin findRouteById(String id) {
    return routeOrigins.firstWhere((el) => el.id == id);
  }

  @override
  List<Object> get props => [...dictionaryLevels, ...routeOrigins];
}
