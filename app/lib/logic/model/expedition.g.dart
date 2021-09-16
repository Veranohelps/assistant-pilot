// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'expedition.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Expedition _$ExpeditionFromJson(Map<String, dynamic> json) {
  return Expedition(
    id: json['id'] as String,
    name: json['name'] as String,
    description: json['description'] as String,
    routes: (json['routes'] as List<dynamic>)
        .map((e) => DersuUrlModel.fromJson(e as Map<String, dynamic>))
        .toList(),
    waypoints: (json['waypoints'] as List<dynamic>)
        .map((e) => Waypoint.fromJson(e as Map<String, dynamic>))
        .toList(),
    coordinate:
        PointGeometry.fromJson(json['coordinate'] as Map<String, dynamic>),
    startDateTime: DateTime.parse(json['startDateTime'] as String),
    endDateTime: DateTime.parse(json['endDateTime'] as String),
    updatedAt: DateTime.parse(json['updatedAt'] as String),
  );
}

Map<String, dynamic> _$ExpeditionToJson(Expedition instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'coordinate': instance.coordinate,
      'startDateTime': instance.startDateTime.toIso8601String(),
      'endDateTime': instance.endDateTime.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'routes': instance.routes,
      'waypoints': instance.waypoints,
    };
