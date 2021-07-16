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

DersuLocation _$DersuLocationFromJson(Map<String, dynamic> json) {
  return DersuLocation(
    latitude: (json['latitude'] as num).toDouble(),
    longitude: (json['longitude'] as num).toDouble(),
  );
}
