import 'package:json_annotation/json_annotation.dart';

part 'route_point.g.dart';

@JsonSerializable(explicitToJson: true)
class RoutePoint {
  final double latitude;
  final double longitude;
  final double altitude;

  RoutePoint({
    required this.latitude,
    required this.longitude,
    required this.altitude,
  });

  factory RoutePoint.fromJson(Map<String, dynamic> json) =>
      _$RoutePointFromJson(json);

  Map<String, dynamic> toJson() => _$RoutePointToJson(this);
}
