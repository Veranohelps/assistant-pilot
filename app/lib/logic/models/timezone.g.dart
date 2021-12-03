// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'timezone.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Timezone _$TimezoneFromJson(Map<String, dynamic> json) => Timezone(
      dstOffset: json['dstOffset'] as int,
      rawOffset: json['rawOffset'] as int,
      timeZoneId: json['timeZoneId'] as String,
      timeZoneName: json['timeZoneName'] as String,
    );

Map<String, dynamic> _$TimezoneToJson(Timezone instance) => <String, dynamic>{
      'dstOffset': instance.dstOffset,
      'rawOffset': instance.rawOffset,
      'timeZoneId': instance.timeZoneId,
      'timeZoneName': instance.timeZoneName,
    };
