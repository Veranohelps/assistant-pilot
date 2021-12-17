// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'expedition_event.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExpeditionEvent _$ExpeditionEventFromJson(Map<String, dynamic> json) =>
    ExpeditionEvent(
      type: $enumDecode(_$ExpeditionEventTypeEnumMap, json['type']),
      dateTime: DateTime.parse(json['dateTime'] as String),
      coordinates:
          PointCoordinates.fromJson(json['coordinates'] as List<dynamic>),
    );

Map<String, dynamic> _$ExpeditionEventToJson(ExpeditionEvent instance) =>
    <String, dynamic>{
      'type': _$ExpeditionEventTypeEnumMap[instance.type],
      'dateTime': instance.dateTime.toIso8601String(),
      'coordinates': instance.coordinates,
    };

const _$ExpeditionEventTypeEnumMap = {
  ExpeditionEventType.start: 'start',
  ExpeditionEventType.finish: 'finish',
  ExpeditionEventType.location: 'location',
  ExpeditionEventType.waypoint: 'waypoint',
};
