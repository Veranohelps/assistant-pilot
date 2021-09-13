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
    coordinate:
        LineStringGeometry.fromJson(json['coordinate'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$DersuRouteToJson(DersuRoute instance) =>
    <String, dynamic>{
      'name': instance.name,
      'coordinate': instance.coordinate.toJson(),
    };
