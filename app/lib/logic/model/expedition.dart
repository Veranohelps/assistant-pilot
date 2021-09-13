import 'package:app/logic/model/route.dart';
import 'package:app/logic/model/waypoint.dart';
import 'package:app/logic/model/geo_json.dart';
import 'package:json_annotation/json_annotation.dart';

part 'expedition.g.dart';

@JsonSerializable()
class Expedition {
  Expedition({
    required this.name,
    required this.routes,
    required this.waypoints,
    required this.coordinate,
  });
  final String name;
  final PointGeometry coordinate;
  final List<RoutePreInfo> routes;
  final List<Waypoint> waypoints;

  factory Expedition.fromJson(Map<String, dynamic> json) =>
      _$ExpeditionFromJson(json);

  Map<String, dynamic> toJson() => _$ExpeditionToJson(this);
}
