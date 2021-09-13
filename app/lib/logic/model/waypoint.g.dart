// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'waypoint.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Waypoint _$WaypointFromJson(Map<String, dynamic> json) {
  return Waypoint(
    id: json['id'] as String,
    name: json['name'] as String,
    description: json['description'] as String,
    type: json['type'] as String,
    radiusInMeters: json['radiusInMeters'] as num,
    updatedAt: DateTime.parse(json['updatedAt'] as String),
    coordinate:
        PointGeometry.fromJson(json['coordinate'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$WaypointToJson(Waypoint instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'type': instance.type,
      'radiusInMeters': instance.radiusInMeters,
      'updatedAt': instance.updatedAt.toIso8601String(),
      'coordinate': instance.coordinate,
    };
