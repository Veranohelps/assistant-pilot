import 'package:json_annotation/json_annotation.dart';

import 'package:app/logic/models/serialization.dart';

part 'range_forecast.g.dart';

@JsonSerializable(createToJson: false)
class RangeForecast {
  @JsonKey(fromJson: Serialization.rangeFromString)
  final List<int> range;
  final double temperature;
  final double? feltTemperature;
  final num precipitation;
  final num precipitationProbability;
  final int? visibility;
  final int lowClouds;
  final int midClouds;
  final int hiClouds;
  final int totalCloudCover;
  final double windSpeed;
  final double windGust;
  final bool isDay;
  final int pictoCode;

  RangeForecast({
    required this.range,
    required this.temperature,
    this.feltTemperature,
    required this.precipitation,
    required this.precipitationProbability,
    this.visibility,
    required this.lowClouds,
    required this.midClouds,
    required this.hiClouds,
    required this.totalCloudCover,
    required this.windSpeed,
    required this.windGust,
    required this.isDay,
    required this.pictoCode,
  });

  static RangeForecast fromJson(Map<String, dynamic> json) =>
      _$RangeForecastFromJson(json);
}
