import 'package:app/logic/models/serialization.dart';
import 'package:app/logic/models/waypoint.dart';
import 'package:equatable/equatable.dart';
import 'package:app/logic/models/geo_json.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:json_annotation/json_annotation.dart';

part 'route.g.dart';

abstract class DersuRoute extends Equatable {
  final String name;
  final String originId;
  final String? userId;
  final String id;
  final DateTime updatedAt;
  final List<String> activityTypeIds;

  DersuRoute({
    required this.id,
    required this.name,
    required this.originId,
    required this.userId,
    required this.updatedAt,
    required this.activityTypeIds,
  });

  @override
  String toString() {
    return "DersuRoute, name: $name";
  }

  @override
  List<Object?> get props => [name, originId, userId, id, ...activityTypeIds];
}

@JsonSerializable()
class DersuRouteFull extends DersuRoute {
  final LineStringGeometry coordinate;
  final List<Waypoint> waypoints;

  @JsonKey(
    fromJson: Serialization.fromJsonToLatLngBounds,
    toJson: Serialization.fromLatLngBoundsToJson,
  )
  final LatLngBounds boundaries;

  DersuRouteFull({
    required String id,
    required String name,
    required String originId,
    required DateTime updatedAt,
    required List<String> activityTypeIds,
    required this.coordinate,
    required this.boundaries,
    this.waypoints = const [],
    String? userId,
  }) : super(
          id: id,
          name: name,
          originId: originId,
          userId: userId,
          updatedAt: updatedAt,
          activityTypeIds: activityTypeIds,
        );

  List<PointCoordinates> get coordinates => coordinate.coordinates;

  @override
  List<Object?> get props => [
        id,
        name,
        originId,
        userId,
        updatedAt,
        ...activityTypeIds,
        coordinate,
        boundaries,
        ...waypoints,
      ];

  factory DersuRouteFull.fromJson(Map<String, dynamic> json) =>
      _$DersuRouteFullFromJson(json);

  Map<String, dynamic> toJson() => _$DersuRouteFullToJson(this);
}

@JsonSerializable(createToJson: false)
class DersuRouteShort extends DersuRoute {
  final String url;

  DersuRouteShort({
    required String id,
    required String name,
    required String originId,
    required DateTime updatedAt,
    required List<String> activityTypeIds,
    required this.url,
    String? userId,
  }) : super(
          id: id,
          name: name,
          originId: originId,
          userId: userId,
          updatedAt: updatedAt,
          activityTypeIds: activityTypeIds,
        );

  @override
  List<Object?> get props => [
        id,
        name,
        originId,
        userId,
        updatedAt,
        ...activityTypeIds,
        url,
      ];

  factory DersuRouteShort.fromJson(Map<String, dynamic> json) =>
      _$DersuRouteShortFromJson(json);
}
