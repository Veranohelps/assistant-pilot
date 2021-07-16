import 'package:app/logic/model/route_point.dart';
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
    required this.latitude,
    required this.longitude,
    required this.altitude,
  });

  final String id;
  final String name;
  final String description;
  final String type;
  @JsonKey(name: 'radius_in_meters')
  final num radiusInMeters;
  final double latitude;
  final double longitude;
  final double altitude;

  RoutePoint get point => RoutePoint(
        altitude: altitude,
        longitude: longitude,
        latitude: latitude,
      );

  @override
  String toString() {
    return "Waypoint (type: $type)";
  }

  factory Waypoint.fromJson(Map<String, dynamic> json) =>
      _$WaypointFromJson(json);
}
