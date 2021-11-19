// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'weather_forecast.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

WeatherForecast _$WeatherForecastFromJson(Map<String, dynamic> json) =>
    WeatherForecast(
      sunCalendar: (json['sunCalendar'] as List<dynamic>)
          .map((e) => SunCalendarItem.fromJson(e as Map<String, dynamic>))
          .toList(),
      forecastHourly: (json['forecastHourly'] as List<dynamic>)
          .map((e) => HourlyForecast.fromJson(e as Map<String, dynamic>))
          .toList(),
      meteograms: (json['meteograms'] as List<dynamic>)
          .map((e) => Meteogram.fromJson(e as Map<String, dynamic>))
          .toList(),
      metadata:
          WeatherMetadata.fromJson(json['metadata'] as Map<String, dynamic>),
    );
