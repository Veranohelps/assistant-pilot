// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_expedition.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Map<String, dynamic> _$CreateExpeditionDtoToJson(CreateExpeditionDto instance) {
  final val = <String, dynamic>{
    'routes': instance.routes,
    'name': instance.name,
  };

  void writeNotNull(String key, dynamic value) {
    if (value != null) {
      val[key] = value;
    }
  }

  writeNotNull('description', instance.description);
  return val;
}
