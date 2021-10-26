import 'package:app/logic/models/serialization.dart';
import 'package:json_annotation/json_annotation.dart';

part 'hourly_forecast.g.dart';

@JsonSerializable(createToJson: false)
class HourlyForecast {
  @JsonKey(fromJson: Serialization.fromUtcStringToLocal)
  final DateTime dateTime;
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
  final int? isDay;
  final int pictoCode;

  HourlyForecast({
    required this.dateTime,
    required this.temperature,
    required this.feltTemperature,
    required this.precipitation,
    required this.precipitationProbability,
    required this.visibility,
    required this.lowClouds,
    required this.midClouds,
    required this.hiClouds,
    required this.totalCloudCover,
    required this.windSpeed,
    required this.windGust,
    required this.isDay,
    required this.pictoCode,
  });

  static HourlyForecast fromJson(Map<String, dynamic> json) =>
      _$HourlyForecastFromJson(json);
}
