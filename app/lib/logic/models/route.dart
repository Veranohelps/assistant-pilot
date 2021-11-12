import 'package:equatable/equatable.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:json_annotation/json_annotation.dart';

import 'package:app/logic/models/geo_json.dart';
import 'package:app/logic/models/serialization.dart';
import 'package:app/logic/models/waypoint.dart';

part 'route.g.dart';

abstract class DersuRoute extends Equatable {
  final String name;
  final String originId;
  final String? userId;
  final String id;
  final DateTime updatedAt;
  final List<String> activityTypeIds;
  final List<String> levelIds;

  // final List<MultyPointGeometry> meteoPointsOfInterests;
  final double distanceInMeters;
  final double elevationGainInMeters;
  final double elevationLossInMeters;
  final double highestPointInMeters;
  final double lowestPointInMeters;

  const DersuRoute({
    required this.id,
    required this.name,
    required this.originId,
    required this.userId,
    required this.updatedAt,
    required this.activityTypeIds,
    // required this.meteoPointsOfInterests,
    required this.distanceInMeters,
    required this.elevationGainInMeters,
    required this.elevationLossInMeters,
    required this.highestPointInMeters,
    required this.lowestPointInMeters,
    required this.levelIds,
  });

  @override
  String toString() {
    return "DersuRoute, name: $name";
  }

  @override
  List<Object?> get props => [name, originId, userId, id, ...activityTypeIds];

  String get distanceInMetersToString => _stringFix(distanceInMeters);
  String get elevationGainInMetersToString => _stringFix(elevationGainInMeters);
  String get elevationLossInMetersToString => _stringFix(elevationLossInMeters);

  String _stringFix(double number) =>
      number.round() == 0 ? '1' : number.round().toString();
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

  const DersuRouteFull({
    required String id,
    required String name,
    required String originId,
    required DateTime updatedAt,
    required List<String> activityTypeIds,
    required List<String> levelIds,
    required this.coordinate,
    required this.boundaries,
    // required List<MultyPointGeometry> meteoPointsOfInterests,
    required double distanceInMeters,
    required double elevationGainInMeters,
    required double elevationLossInMeters,
    required double highestPointInMeters,
    required double lowestPointInMeters,
    this.waypoints = const [],
    String? userId,
  }) : super(
          id: id,
          name: name,
          originId: originId,
          userId: userId,
          updatedAt: updatedAt,
          activityTypeIds: activityTypeIds,
          // meteoPointsOfInterests: meteoPointsOfInterests,
          distanceInMeters: distanceInMeters,
          elevationGainInMeters: elevationGainInMeters,
          elevationLossInMeters: elevationLossInMeters,
          highestPointInMeters: highestPointInMeters,
          lowestPointInMeters: lowestPointInMeters,
          levelIds: levelIds,
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

  const DersuRouteShort({
    required String id,
    required String name,
    required String originId,
    required DateTime updatedAt,
    required List<String> activityTypeIds,
    required List<String> levelIds,
    // required List<MultyPointGeometry> meteoPointsOfInterests,
    required double distanceInMeters,
    required double elevationGainInMeters,
    required double elevationLossInMeters,
    required double highestPointInMeters,
    required double lowestPointInMeters,
    required this.url,
    String? userId,
  }) : super(
          id: id,
          name: name,
          originId: originId,
          userId: userId,
          updatedAt: updatedAt,
          activityTypeIds: activityTypeIds,
          // meteoPointsOfInterests: meteoPointsOfInterests,
          distanceInMeters: distanceInMeters,
          elevationGainInMeters: elevationGainInMeters,
          elevationLossInMeters: elevationLossInMeters,
          highestPointInMeters: highestPointInMeters,
          lowestPointInMeters: lowestPointInMeters,
          levelIds: levelIds,
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
