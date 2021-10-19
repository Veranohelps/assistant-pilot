import 'package:app/logic/models/geo_json.dart';
import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

part 'waypoint.g.dart';

@JsonSerializable()
class Waypoint extends Equatable {
  Waypoint({
    required this.id,
    required this.type,
    required this.name,
    required this.radiusInMeters,
    required this.updatedAt,
    required this.coordinate,
  });

  final String id;
  final String type;
  final String name;
  final num radiusInMeters;
  final PointGeometry coordinate;
  final DateTime updatedAt;



  @override
  String toString() {
    return "Waypoint (type: $type)";
  }

  factory Waypoint.fromJson(Map<String, dynamic> json) =>
      _$WaypointFromJson(json);

  Map<String, dynamic> toJson() => _$WaypointToJson(this);

  @override
  List<Object?> get props =>
      [id, name, type, radiusInMeters, updatedAt, coordinate];
}
