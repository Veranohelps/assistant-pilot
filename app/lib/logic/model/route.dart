import 'package:app/logic/model/geo_json.dart';
import 'package:json_annotation/json_annotation.dart';

part 'route.g.dart';

@JsonSerializable()
class RoutePreInfo {
  final String id;
  final String url;

  RoutePreInfo({required this.id, required this.url});

  factory RoutePreInfo.fromJson(Map<String, dynamic> json) =>
      _$RoutePreInfoFromJson(json);

  @override
  String toString() {
    return "RoutePreInfo, id: $id, url: $url";
  }

  Map<String, dynamic> toJson() => _$RoutePreInfoToJson(this);
}

@JsonSerializable(explicitToJson: true)
class DersuRoute {
  DersuRoute({required this.name, required this.coordinate});
  final String name;
  final LineStringGeometry coordinate;

  @override
  String toString() {
    return "DersuRoute, name: $name";
  }

  factory DersuRoute.fromJson(Map<String, dynamic> json) =>
      _$DersuRouteFromJson(json);

  Map<String, dynamic> toJson() => _$DersuRouteToJson(this);
}
