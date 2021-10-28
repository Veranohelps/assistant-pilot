import 'package:app/logic/models/geo_json.dart';
import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

part 'waypoint.g.dart';

@JsonSerializable()
class Waypoint extends Equatable {
  Waypoint({
    required this.id,
    required this.typeIds,
    required this.name,
    required this.radiusInMeters,
    required this.updatedAt,
    required this.coordinate,
  });

  final String id;
  final List<String> typeIds;
  final String name;
  final num radiusInMeters;
  final PointGeometry coordinate;
  final DateTime updatedAt;

  @override
  String toString() {
    return "Waypoint (typeIds: $typeIds)";
  }

  factory Waypoint.fromJson(Map<String, dynamic> json) =>
      _$WaypointFromJson(json);

  Map<String, dynamic> toJson() => _$WaypointToJson(this);

  @override
  List<Object?> get props =>
      [id, name, ...typeIds, radiusInMeters, updatedAt, coordinate];
}
