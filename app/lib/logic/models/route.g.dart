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
      coordinate: LineStringGeometry.fromJson(
          json['coordinate'] as Map<String, dynamic>),
      boundaries: Serialization.fromJsonToLatLngBounds(
          json['boundaries'] as Map<String, dynamic>),
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
      url: json['url'] as String,
      userId: json['userId'] as String?,
    );
