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
  final List<ActivityType> activeTypes;

  bool get isNotEmtpy => props.isNotEmpty;
  bool get isEmpty => props.isEmpty;

  const DictionariesLoaded({
    required this.dictionaryLevels,
    required this.routeOrigins,
    required this.activeTypes,
  });

  RouteOrigin findRouteById(String id) {
    return routeOrigins.firstWhere((el) => el.id == id);
  }

  ActivityType findActiveTypeById(String id) {
    return activeTypes.firstWhere((el) => el.id == id);
  }

  @override
  List<Object> get props => [
        ...dictionaryLevels,
        ...routeOrigins,
        ...activeTypes,
      ];
}
