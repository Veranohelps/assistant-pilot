import 'package:app/logic/models/estimation.dart';
import 'package:app/logic/models/timezone.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:json_annotation/json_annotation.dart';

import 'package:app/logic/models/geo_json.dart';
import 'package:app/logic/models/serialization.dart';
import 'package:app/logic/models/waypoint.dart';

part 'route.g.dart';

abstract class DersuRoute extends Equatable {
  final String name;
  final OriginId originId;
  final String? userId;
  final String id;
  final DateTime updatedAt;
  final List<String> activityTypeIds;
  final List<String> levelIds;
  final String? description;

  final double distanceInMeters;
  final double elevationGainInMeters;
  final double elevationLossInMeters;
  final double highestPointInMeters;
  final double lowestPointInMeters;

  const DersuRoute({
    required this.id,
    required this.name,
    required this.description,
    required this.originId,
    required this.userId,
    required this.updatedAt,
    required this.activityTypeIds,
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

  String get distanceInMetersToString {
    var inKm = distanceInMeters / 1000;
    return inKm.toStringAsFixed(2).replaceAll('.', ',');
  }

  String get elevationGainInMetersToString => _stringFix(elevationGainInMeters);
  String get elevationLossInMetersToString => _stringFix(elevationLossInMeters);

  String _stringFix(double number) =>
      number.round() == 0 ? '1' : number.round().toString();
}

List<Estimation> sorted(List<Estimation> list) {
  list.sort((a, b) => a.duration.compareTo(b.duration));
  return list;
}

@JsonSerializable()
class DersuRouteFull extends DersuRoute {
  final LineStringGeometry coordinate;
  final List<Waypoint> waypoints;
  final Timezone timezone;

  final List<Estimation> _estimations;

  @JsonKey(
    name: 'activities',
    fromJson: Serialization.fromJsonMapToEstimationList,
    toJson: Serialization.fromEstimationListToJsonMap,
  )
  List<Estimation> get estimations {
    /// always sorted from fastest to slowest
    final list = [..._estimations];
    list.sort(
      (a, b) => a.duration.compareTo(b.duration),
    );

    return list;
  }

  Estimation get slowest => estimations.last;

  @JsonKey(
    fromJson: Serialization.fromJsonToLatLngBounds,
    toJson: Serialization.fromLatLngBoundsToJson,
  )
  final LatLngBounds boundaries;
  final MultyPointGeometry meteoPointsOfInterests;

  const DersuRouteFull({
    required String id,
    required String name,
    required String? description,
    required OriginId originId,
    required DateTime updatedAt,
    required List<String> activityTypeIds,
    required List<String> levelIds,
    required this.coordinate,
    required this.boundaries,
    required this.meteoPointsOfInterests,
    required double distanceInMeters,
    required double elevationGainInMeters,
    required double elevationLossInMeters,
    required double highestPointInMeters,
    required double lowestPointInMeters,
    required this.timezone,
    required List<Estimation> estimations,
    this.waypoints = const [],
    String? userId,
  })  : _estimations = estimations,
        super(
          id: id,
          name: name,
          originId: originId,
          userId: userId,
          updatedAt: updatedAt,
          activityTypeIds: activityTypeIds,
          description: description,
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
        ...super.props,
        ...coordinates,
        ...waypoints,
        ...estimations,
        boundaries,
        timezone,
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
    required String? description,
    required OriginId originId,
    required DateTime updatedAt,
    required List<String> activityTypeIds,
    required List<String> levelIds,
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
          description: description,
          originId: originId,
          userId: userId,
          updatedAt: updatedAt,
          activityTypeIds: activityTypeIds,
          distanceInMeters: distanceInMeters,
          elevationGainInMeters: elevationGainInMeters,
          elevationLossInMeters: elevationLossInMeters,
          highestPointInMeters: highestPointInMeters,
          lowestPointInMeters: lowestPointInMeters,
          levelIds: levelIds,
        );

  @override
  List<Object?> get props => [
        ...super.props,
        url,
      ];

  factory DersuRouteShort.fromJson(Map<String, dynamic> json) =>
      _$DersuRouteShortFromJson(json);
}

enum OriginId {
  @JsonValue("dersu")
  dersu,
  @JsonValue("manual")
  manual,
}

List<Estimation> ab(List<Estimation> list) {
  return list;
}
