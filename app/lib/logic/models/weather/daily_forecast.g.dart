// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'daily_forecast.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SunCalendarItem _$SunCalendarItemFromJson(Map<String, dynamic> json) =>
    SunCalendarItem(
      dateTime: TimeWithTimeZone.parse(json['dateTime'] as String),
      sunriseDateTime:
          TimeWithTimeZone.parse(json['sunriseDateTime'] as String),
      sunsetDateTime: TimeWithTimeZone.parse(json['sunsetDateTime'] as String),
      moonriseDateTime:
          TimeWithTimeZone.parse(json['moonriseDateTime'] as String),
      moonsetDatetime:
          TimeWithTimeZone.parse(json['moonsetDatetime'] as String),
      moonPhaseName: json['moonPhaseName'] as String,
    );
