import 'package:app/logic/model/route.dart';
import 'package:app/logic/model/waypoint.dart';
import 'package:json_annotation/json_annotation.dart';

part 'expedition.g.dart';

@JsonSerializable(explicitToJson: true)
class Expedition {
  Expedition(
      {required this.name,
      required this.routes,
      required this.waypoints,
      required this.location});
  final String name;
  final DersuLocation location;
  final List<RoutePreInfo> routes;
  final List<Waypoint> waypoints;

  factory Expedition.fromJson(Map<String, dynamic> json) =>
      _$ExpeditionFromJson(json);

  Map<String, dynamic> toJson() => _$ExpeditionToJson(this);
}

@JsonSerializable(explicitToJson: true)
class DersuLocation {
  DersuLocation({
    required this.latitude,
    required this.longitude,
  });
  final double latitude;
  final double longitude;

  factory DersuLocation.fromJson(Map<String, dynamic> json) =>
      _$DersuLocationFromJson(json);

  Map<String, dynamic> toJson() => _$DersuLocationToJson(this);
}
