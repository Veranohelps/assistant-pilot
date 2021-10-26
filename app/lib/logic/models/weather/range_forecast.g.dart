// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'range_forecast.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

RangeForecast _$RangeForecastFromJson(Map<String, dynamic> json) {
  return RangeForecast(
    range: Serialization.rangeFromString(json['range'] as String),
    forecastHourly: (json['forecastHourly'] as List<dynamic>)
        .map((e) => HourlyForecast.fromJson(e as Map<String, dynamic>))
        .toList(),
  );
}
