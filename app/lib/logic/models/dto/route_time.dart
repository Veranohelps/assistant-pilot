import 'package:json_annotation/json_annotation.dart';

part 'route_time.g.dart';

@JsonSerializable(createFactory: false, explicitToJson: true)
class RouteWithStartTimeDto {
  String routeId;
  DateTime startDateTime;

  RouteWithStartTimeDto({
    required this.routeId,
    required this.startDateTime,
  });

  Map<String, dynamic> toJson() => _$RouteWithStartTimeDtoToJson(this);
}
