// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'waypoint.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Waypoint _$WaypointFromJson(Map<String, dynamic> json) {
  return Waypoint(
    id: json['id'] as String,
    type: json['type'] as String,
    name: json['name'] as String,
    radiusInMeters: json['radiusInMeters'] as num,
    updatedAt: DateTime.parse(json['updatedAt'] as String),
    coordinate:
        PointGeometry.fromJson(json['coordinate'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$WaypointToJson(Waypoint instance) => <String, dynamic>{
      'id': instance.id,
      'type': instance.type,
      'name': instance.name,
      'radiusInMeters': instance.radiusInMeters,
      'coordinate': instance.coordinate,
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
