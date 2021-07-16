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

DersuRoute _$DersuRouteFromJson(Map<String, dynamic> json) {
  return DersuRoute(
    name: json['name'] as String,
    points: (json['coordinates'] as List<dynamic>)
        .map((e) => RoutePoint.fromJson(e as Map<String, dynamic>))
        .toList(),
  );
}
