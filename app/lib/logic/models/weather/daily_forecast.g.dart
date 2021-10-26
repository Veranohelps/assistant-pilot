// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'daily_forecast.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DayForecast _$DayForecastFromJson(Map<String, dynamic> json) {
  return DayForecast(
    ranges: (json['ranges'] as List<dynamic>)
        .map((e) => RangeForecast.fromJson(e as Map<String, dynamic>))
        .toList(),
    dateTime: DateTime.parse(json['dateTime'] as String),
    sunriseDateTime:
        Serialization.fromUtcStringToLocal(json['sunriseDateTime'] as String),
    sunsetDateTime:
        Serialization.fromUtcStringToLocal(json['sunsetDateTime'] as String),
  );
}
