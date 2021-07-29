// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'route.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

RoutePreInfo _$RoutePreInfoFromJson(Map<String, dynamic> json) {
  return RoutePreInfo(
    id: json['id'] as String,
    url: json['url'] as String,
  );
}

Map<String, dynamic> _$RoutePreInfoToJson(RoutePreInfo instance) =>
    <String, dynamic>{
      'id': instance.id,
      'url': instance.url,
    };

DersuRoute _$DersuRouteFromJson(Map<String, dynamic> json) {
  return DersuRoute(
    name: json['name'] as String,
    points: (json['coordinates'] as List<dynamic>)
        .map((e) => RoutePoint.fromJson(e as Map<String, dynamic>))
        .toList(),
  );
}

Map<String, dynamic> _$DersuRouteToJson(DersuRoute instance) =>
    <String, dynamic>{
      'name': instance.name,
      'coordinates': instance.points.map((e) => e.toJson()).toList(),
    };
