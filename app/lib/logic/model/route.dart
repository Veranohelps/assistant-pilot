import 'package:app/logic/model/geo_json.dart';
import 'package:json_annotation/json_annotation.dart';

part 'route.g.dart';

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
