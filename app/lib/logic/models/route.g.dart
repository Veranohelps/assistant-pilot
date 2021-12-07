// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'route.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DersuRouteFull _$DersuRouteFullFromJson(Map<String, dynamic> json) =>
    DersuRouteFull(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      originId: $enumDecode(_$OriginIdEnumMap, json['originId']),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      activityTypeIds: (json['activityTypeIds'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      levelIds:
          (json['levelIds'] as List<dynamic>).map((e) => e as String).toList(),
      coordinate: LineStringGeometry.fromJson(
          json['coordinate'] as Map<String, dynamic>),
      boundaries: Serialization.fromJsonToLatLngBounds(
          json['boundaries'] as Map<String, dynamic>),
      meteoPointsOfInterests: MultyPointGeometry.fromJson(
          json['meteoPointsOfInterests'] as Map<String, dynamic>),
      distanceInMeters: (json['distanceInMeters'] as num).toDouble(),
      elevationGainInMeters: (json['elevationGainInMeters'] as num).toDouble(),
      elevationLossInMeters: (json['elevationLossInMeters'] as num).toDouble(),
      highestPointInMeters: (json['highestPointInMeters'] as num).toDouble(),
      lowestPointInMeters: (json['lowestPointInMeters'] as num).toDouble(),
      timezone: Timezone.fromJson(json['timezone'] as Map<String, dynamic>),
      estimations: Serialization.toEstimations(
          json['activities'] as Map<String, dynamic>?),
      waypoints: (json['waypoints'] as List<dynamic>?)
              ?.map((e) => Waypoint.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      userId: json['userId'] as String?,
    );

Map<String, dynamic> _$DersuRouteFullToJson(DersuRouteFull instance) =>
    <String, dynamic>{
      'name': instance.name,
      'originId': _$OriginIdEnumMap[instance.originId],
      'userId': instance.userId,
      'id': instance.id,
      'updatedAt': instance.updatedAt.toIso8601String(),
      'activityTypeIds': instance.activityTypeIds,
      'levelIds': instance.levelIds,
      'description': instance.description,
      'distanceInMeters': instance.distanceInMeters,
      'elevationGainInMeters': instance.elevationGainInMeters,
      'elevationLossInMeters': instance.elevationLossInMeters,
      'highestPointInMeters': instance.highestPointInMeters,
      'lowestPointInMeters': instance.lowestPointInMeters,
      'coordinate': instance.coordinate,
      'waypoints': instance.waypoints,
      'timezone': instance.timezone,
      'activities': instance.estimations,
      'boundaries': Serialization.fromLatLngBoundsToJson(instance.boundaries),
      'meteoPointsOfInterests': instance.meteoPointsOfInterests,
    };

const _$OriginIdEnumMap = {
  OriginId.dersu: 'dersu',
  OriginId.manual: 'manual',
};

DersuRouteShort _$DersuRouteShortFromJson(Map<String, dynamic> json) =>
    DersuRouteShort(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      originId: $enumDecode(_$OriginIdEnumMap, json['originId']),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      activityTypeIds: (json['activityTypeIds'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      levelIds:
          (json['levelIds'] as List<dynamic>).map((e) => e as String).toList(),
      distanceInMeters: (json['distanceInMeters'] as num).toDouble(),
      elevationGainInMeters: (json['elevationGainInMeters'] as num).toDouble(),
      elevationLossInMeters: (json['elevationLossInMeters'] as num).toDouble(),
      highestPointInMeters: (json['highestPointInMeters'] as num).toDouble(),
      lowestPointInMeters: (json['lowestPointInMeters'] as num).toDouble(),
      url: json['url'] as String,
      userId: json['userId'] as String?,
    );
