// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'expedition.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Expedition _$ExpeditionFromJson(Map<String, dynamic> json) {
  return Expedition(
    name: json['name'] as String,
    routes: (json['routes'] as List<dynamic>)
        .map((e) => RoutePreInfo.fromJson(e as Map<String, dynamic>))
        .toList(),
    waypoints: (json['waypoints'] as List<dynamic>)
        .map((e) => Waypoint.fromJson(e as Map<String, dynamic>))
        .toList(),
    location: DersuLocation.fromJson(json['location'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$ExpeditionToJson(Expedition instance) =>
    <String, dynamic>{
      'name': instance.name,
      'location': instance.location.toJson(),
      'routes': instance.routes.map((e) => e.toJson()).toList(),
      'waypoints': instance.waypoints.map((e) => e.toJson()).toList(),
    };

DersuLocation _$DersuLocationFromJson(Map<String, dynamic> json) {
  return DersuLocation(
    latitude: (json['latitude'] as num).toDouble(),
    longitude: (json['longitude'] as num).toDouble(),
  );
}

Map<String, dynamic> _$DersuLocationToJson(DersuLocation instance) =>
    <String, dynamic>{
      'latitude': instance.latitude,
      'longitude': instance.longitude,
    };
