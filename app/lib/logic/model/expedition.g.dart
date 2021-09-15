// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'expedition.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Expedition _$ExpeditionFromJson(Map<String, dynamic> json) {
  return Expedition(
    name: json['name'] as String,
    routes: (json['routes'] as List<dynamic>)
        .map((e) => DersuUrlModel.fromJson(e as Map<String, dynamic>))
        .toList(),
    waypoints: (json['waypoints'] as List<dynamic>)
        .map((e) => Waypoint.fromJson(e as Map<String, dynamic>))
        .toList(),
    coordinate:
        PointGeometry.fromJson(json['coordinate'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$ExpeditionToJson(Expedition instance) =>
    <String, dynamic>{
      'name': instance.name,
      'coordinate': instance.coordinate,
      'routes': instance.routes,
      'waypoints': instance.waypoints,
    };
