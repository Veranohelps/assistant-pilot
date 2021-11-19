// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'weather_metadata.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

WeatherMetadata _$WeatherMetadataFromJson(Map<String, dynamic> json) =>
    WeatherMetadata(
      provider: json['provider'] as String,
      timezone: json['timezone'] as String,
      timezoneUTCOffsetInMinutes: json['timezoneUTCOffsetInMinutes'] as int,
      dailyMode: json['dailyMode'] as bool,
    );
