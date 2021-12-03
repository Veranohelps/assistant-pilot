import 'package:app/logic/models/serialization.dart';
import 'package:app/logic/models/time_with_timezone.dart';
import 'package:json_annotation/json_annotation.dart';

part 'route_time.g.dart';

@JsonSerializable(createFactory: false, explicitToJson: true)
class RouteWithStartTimeDto {
  String routeId;

  @JsonKey(toJson: Serialization.fromTimeWithTimeZoneToString)
  TimeWithTimeZone startDateTime;

  RouteWithStartTimeDto({
    required this.routeId,
    required this.startDateTime,
  });

  Map<String, dynamic> toJson() => _$RouteWithStartTimeDtoToJson(this);
}
