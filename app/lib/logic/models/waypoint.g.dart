// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'waypoint.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Waypoint _$WaypointFromJson(Map<String, dynamic> json) => Waypoint(
      id: json['id'] as String,
      typeIds:
          (json['typeIds'] as List<dynamic>).map((e) => e as String).toList(),
      name: json['name'] as String,
      description: json['description'] as String?,
      radiusInMeters: json['radiusInMeters'] as num,
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      coordinate:
          PointGeometry.fromJson(json['coordinate'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$WaypointToJson(Waypoint instance) => <String, dynamic>{
      'id': instance.id,
      'typeIds': instance.typeIds,
      'name': instance.name,
      'description': instance.description,
      'radiusInMeters': instance.radiusInMeters,
      'coordinate': instance.coordinate,
      'updatedAt': instance.updatedAt.toIso8601String(),
    };
