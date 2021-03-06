// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'expedition.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExpeditionShort _$ExpeditionShortFromJson(Map<String, dynamic> json) =>
    ExpeditionShort(
      id: json['id'] as String,
      name: json['name'] as String,
      coordinate:
          PointGeometry.fromJson(json['coordinate'] as Map<String, dynamic>),
      startDateTime: DateTime.parse(json['startDateTime'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      activityTypeIds: (json['activityTypeIds'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      userId: json['userId'] as String?,
      description: json['description'] as String?,
      url: json['url'] as String,
    );

ExpeditionFull _$ExpeditionFullFromJson(Map<String, dynamic> json) =>
    ExpeditionFull(
      id: json['id'] as String,
      name: json['name'] as String,
      coordinate:
          PointGeometry.fromJson(json['coordinate'] as Map<String, dynamic>),
      startDateTime: DateTime.parse(json['startDateTime'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      activityTypeIds: (json['activityTypeIds'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      userId: json['userId'] as String?,
      description: json['description'] as String?,
      routes: (json['routes'] as List<dynamic>)
          .map((e) => DersuRouteFull.fromJson(e as Map<String, dynamic>))
          .toList(),
      users: (json['users'] as List<dynamic>)
          .map((e) => GroupUser.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$ExpeditionFullToJson(ExpeditionFull instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'name': instance.name,
      'description': instance.description,
      'coordinate': instance.coordinate,
      'startDateTime': instance.startDateTime.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'activityTypeIds': instance.activityTypeIds,
      'routes': instance.routes,
      'users': instance.users,
    };
