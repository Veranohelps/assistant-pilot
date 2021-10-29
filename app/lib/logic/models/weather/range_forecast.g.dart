// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'range_forecast.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

RangeForecast _$RangeForecastFromJson(Map<String, dynamic> json) {
  return RangeForecast(
    range: Serialization.rangeFromString(json['range'] as String),
    temperature: (json['temperature'] as num).toDouble(),
    feltTemperature: (json['feltTemperature'] as num?)?.toDouble(),
    precipitation: json['precipitation'] as num,
    precipitationProbability: json['precipitationProbability'] as num,
    visibility: json['visibility'] as int?,
    lowClouds: json['lowClouds'] as int,
    midClouds: json['midClouds'] as int,
    hiClouds: json['hiClouds'] as int,
    totalCloudCover: json['totalCloudCover'] as int,
    windSpeed: (json['windSpeed'] as num).toDouble(),
    windGust: (json['windGust'] as num).toDouble(),
    isDay: json['isDay'] as bool,
    pictoCode: json['pictoCode'] as int,
  );
}
