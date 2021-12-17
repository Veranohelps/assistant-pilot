import 'package:json_annotation/json_annotation.dart';

import 'geo_json.dart';

part 'expedition_event.g.dart';

@JsonSerializable()
class ExpeditionEvent {
  final ExpeditionEventType type;
  final DateTime dateTime;
  final PointCoordinates coordinates;

  ExpeditionEvent({
    required this.type,
    required this.dateTime,
    required this.coordinates,
  });

  Map<String, dynamic> toJson() => _$ExpeditionEventToJson(this);

  factory ExpeditionEvent.fromJson(json) => _$ExpeditionEventFromJson(json);
}

enum ExpeditionEventType {
  @JsonValue("start")
  start,
  @JsonValue("finish")
  finish,
  @JsonValue("location")
  location,
  @JsonValue("waypoint")
  waypoint,
}
