import 'package:app/logic/model/url.dart';
import 'package:app/logic/model/waypoint.dart';
import 'package:app/logic/model/geo_json.dart';
import 'package:json_annotation/json_annotation.dart';

part 'expedition.g.dart';

@JsonSerializable()
class Expedition {
  Expedition({
    required this.id,
    required this.name,
    required this.description,
    required this.routes,
    required this.waypoints,
    required this.coordinate,
    required this.startDateTime,
    required this.endDateTime,
    required this.updatedAt,
  });

  final String id;
  final String name;
  final String description;

  final PointGeometry coordinate;
  final DateTime startDateTime;
  final DateTime endDateTime;
  final DateTime updatedAt;
  final List<DersuUrlModel> routes;
  final List<Waypoint> waypoints;

  factory Expedition.fromJson(Map<String, dynamic> json) =>
      _$ExpeditionFromJson(json);

  Map<String, dynamic> toJson() => _$ExpeditionToJson(this);
}
