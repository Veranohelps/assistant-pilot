import 'package:json_annotation/json_annotation.dart';

import 'route_time.dart';

part 'create_expedition.g.dart';

@JsonSerializable(createFactory: false)
class ExpeditionDto {
  final List<RouteWithStartTimeDto> routes;
  final List<String> activityTypes;
  final String name;
  final List<String> invites;
  final List<String>? users;

  @JsonKey(includeIfNull: false)
  String? description;

  ExpeditionDto({
    required this.routes,
    required this.name,
    required this.activityTypes,
    required this.invites,
    this.users,
    this.description,
  }) : assert(routes.isNotEmpty);

  Map<String, dynamic> toJson() => _$ExpeditionDtoToJson(this);
}
