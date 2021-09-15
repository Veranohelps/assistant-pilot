// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'route.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

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
