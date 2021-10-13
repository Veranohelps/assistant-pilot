import 'package:app/logic/models/dto/route_time.dart';
import 'package:json_annotation/json_annotation.dart';

part 'create_expedition.g.dart';

@JsonSerializable(createFactory: false)
class CreateExpeditionDto {
  List<RouteWithStartTimeDto> routes;

  String name;

  @JsonKey(includeIfNull: false)
  String? description;

  CreateExpeditionDto({
    required this.routes,
    required this.name,
    this.description,
  }) : assert(routes.isNotEmpty);

  Map<String, dynamic> toJson() => _$CreateExpeditionDtoToJson(this);
}
