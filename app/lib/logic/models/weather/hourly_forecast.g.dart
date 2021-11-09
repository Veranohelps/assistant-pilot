// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'hourly_forecast.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

HourlyForecast _$HourlyForecastFromJson(Map<String, dynamic> json) =>
    HourlyForecast(
      dateTime: TimeWithTimeZone.parse(json['dateTime'] as String),
      ranges: (json['ranges'] as List<dynamic>)
          .map((e) => RangeForecast.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
