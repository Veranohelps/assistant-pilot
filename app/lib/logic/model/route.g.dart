// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'route.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DersuRouteFull _$DersuRouteFullFromJson(Map<String, dynamic> json) {
  return DersuRouteFull(
    id: json['id'] as String,
    name: json['name'] as String,
    originId: json['originId'] as String,
    updatedAt: DateTime.parse(json['updatedAt'] as String),
    coordinate:
        LineStringGeometry.fromJson(json['coordinate'] as Map<String, dynamic>),
    userId: json['userId'] as String?,
  );
}

Map<String, dynamic> _$DersuRouteFullToJson(DersuRouteFull instance) =>
    <String, dynamic>{
      'name': instance.name,
      'originId': instance.originId,
      'userId': instance.userId,
      'id': instance.id,
      'updatedAt': instance.updatedAt.toIso8601String(),
      'coordinate': instance.coordinate,
    };

DersuRouteShort _$DersuRouteShortFromJson(Map<String, dynamic> json) {
  return DersuRouteShort(
    id: json['id'] as String,
    name: json['name'] as String,
    originId: json['originId'] as String,
    updatedAt: DateTime.parse(json['updatedAt'] as String),
    url: json['url'] as String,
    userId: json['userId'] as String?,
  );
}
