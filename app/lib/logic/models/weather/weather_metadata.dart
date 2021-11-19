import 'package:json_annotation/json_annotation.dart';

part 'weather_metadata.g.dart';

@JsonSerializable(createToJson: false)
class WeatherMetadata {
  final String provider;
  final String timezone;
  final int timezoneUTCOffsetInMinutes;
  final bool dailyMode;

  const WeatherMetadata({
    required this.provider,
    required this.timezone,
    required this.timezoneUTCOffsetInMinutes,
    required this.dailyMode,
  });

  static WeatherMetadata fromJson(Map<String, dynamic> json) =>
      _$WeatherMetadataFromJson(json);
}
