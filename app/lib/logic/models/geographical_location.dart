import 'package:app/logic/models/route.dart';
import 'package:json_annotation/json_annotation.dart';

part 'geographical_location.g.dart';

@JsonSerializable(createToJson: false)
class GeographicalLocation {
  final String fullName;
  final List<DersuRouteShort> routes;

  GeographicalLocation({
    required this.fullName,
    required this.routes,
  });

  factory GeographicalLocation.fromJson(Map<String, dynamic> json) =>
      _$GeographicalLocationFromJson(json);
}
