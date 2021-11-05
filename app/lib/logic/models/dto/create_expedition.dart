import 'package:app/logic/models/dto/route_time.dart';
import 'package:json_annotation/json_annotation.dart';

part 'create_expedition.g.dart';

@JsonSerializable(createFactory: false)
class CreateExpeditionDto {
  final List<RouteWithStartTimeDto> routes;
  final List<String> activityTypes;
  final String name;

  @JsonKey(includeIfNull: false)
  String? description;

  CreateExpeditionDto({
    required this.routes,
    required this.name,
    required this.activityTypes,
    this.description,
  }) : assert(routes.isNotEmpty);

  Map<String, dynamic> toJson() => _$CreateExpeditionDtoToJson(this);
}
