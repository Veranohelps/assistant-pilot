// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_expedition.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Map<String, dynamic> _$ExpeditionDtoToJson(ExpeditionDto instance) {
  final val = <String, dynamic>{
    'routes': instance.routes,
    'activityTypes': instance.activityTypes,
    'name': instance.name,
    'invites': instance.invites,
    'users': instance.users,
  };

  void writeNotNull(String key, dynamic value) {
    if (value != null) {
      val[key] = value;
    }
  }

  writeNotNull('description', instance.description);
  return val;
}
