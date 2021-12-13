part of 'dictionaries_cubit.dart';

abstract class DictionariesState extends AuthenticationDependendState {
  const DictionariesState();

  @override
  List<Object> get props => [];
}

class DictionariesNotLoaded extends DictionariesState {}

class DictionariesLoaded extends DictionariesState {
  final List<Category> levels;
  final List<RouteOrigin> routeOrigins;
  final List<ActivityType> activeTypes;
  final List<WaypointType> waypointTypes;

  bool get isNotEmtpy => props.isNotEmpty;
  bool get isEmpty => props.isEmpty;

  const DictionariesLoaded(
      {required this.levels,
      required this.routeOrigins,
      required this.activeTypes,
      required this.waypointTypes});

  RouteOrigin findRouteById(String id) {
    return routeOrigins.firstWhere((el) => el.id == id);
  }

  List<LevelsCatalogData> levelTreeByLevelId(String id) {
    late Category category;
    late Skill skill;
    late Level level;

    for (var c in levels) {
      for (var s in c.children) {
        for (var l in s.children) {
          if (l.id == id) {
            category = c;
            skill = s;
            level = l;
            break;
          }
        }
      }
    }

    return <LevelsCatalogData>[category, skill, level];
  }

  List<Skill> get allSkils =>
      levels.expand((element) => element.children).toList();

  List<Level> get allLevels =>
      allSkils.expand((element) => element.children).toList();

  ActivityType findActiveTypeById(String id) {
    return activeTypes.firstWhere((el) => el.id == id);
  }

  @override
  List<Object> get props => [
        ...levels,
        ...routeOrigins,
        ...activeTypes,
      ];
}
