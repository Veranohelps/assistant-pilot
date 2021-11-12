// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'route.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DersuRouteFull _$DersuRouteFullFromJson(Map<String, dynamic> json) =>
    DersuRouteFull(
      id: json['id'] as String,
      name: json['name'] as String,
      originId: json['originId'] as String,
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
      distanceInMeters: (json['distanceInMeters'] as num).toDouble(),
      elevationGainInMeters: (json['elevationGainInMeters'] as num).toDouble(),
      elevationLossInMeters: (json['elevationLossInMeters'] as num).toDouble(),
      highestPointInMeters: (json['highestPointInMeters'] as num).toDouble(),
      lowestPointInMeters: (json['lowestPointInMeters'] as num).toDouble(),
      waypoints: (json['waypoints'] as List<dynamic>?)
              ?.map((e) => Waypoint.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      userId: json['userId'] as String?,
    );

Map<String, dynamic> _$DersuRouteFullToJson(DersuRouteFull instance) =>
    <String, dynamic>{
      'name': instance.name,
      'originId': instance.originId,
      'userId': instance.userId,
      'id': instance.id,
      'updatedAt': instance.updatedAt.toIso8601String(),
      'activityTypeIds': instance.activityTypeIds,
      'levelIds': instance.levelIds,
      'distanceInMeters': instance.distanceInMeters,
      'elevationGainInMeters': instance.elevationGainInMeters,
      'elevationLossInMeters': instance.elevationLossInMeters,
      'highestPointInMeters': instance.highestPointInMeters,
      'lowestPointInMeters': instance.lowestPointInMeters,
      'coordinate': instance.coordinate,
      'waypoints': instance.waypoints,
      'boundaries': Serialization.fromLatLngBoundsToJson(instance.boundaries),
    };

DersuRouteShort _$DersuRouteShortFromJson(Map<String, dynamic> json) =>
    DersuRouteShort(
      id: json['id'] as String,
      name: json['name'] as String,
      originId: json['originId'] as String,
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
