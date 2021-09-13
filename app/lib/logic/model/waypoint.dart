import 'package:app/logic/model/geo_json.dart';
import 'package:json_annotation/json_annotation.dart';

part 'waypoint.g.dart';

@JsonSerializable()
class Waypoint {
  Waypoint({
    required this.id,
    required this.name,
    required this.description,
    required this.type,
    required this.radiusInMeters,
    required this.updatedAt,
    required this.coordinate,
  });

  final String id;
  final String name;
  final String description;
  final String type;
  final num radiusInMeters;
  final DateTime updatedAt;

  final PointGeometry coordinate;

  @override
  String toString() {
    return "Waypoint (type: $type)";
  }

  factory Waypoint.fromJson(Map<String, dynamic> json) =>
      _$WaypointFromJson(json);

  Map<String, dynamic> toJson() => _$WaypointToJson(this);
}
