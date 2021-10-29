import 'package:app/logic/models/time_with_timezone.dart';
import 'package:app/logic/models/weather/range_forecast.dart';
import 'package:json_annotation/json_annotation.dart';

part 'hourly_forecast.g.dart';

@JsonSerializable(createToJson: false)
class HourlyForecast {
  @JsonKey(fromJson: TimeWithTimeZone.parse)
  final TimeWithTimeZone dateTime;

  final List<RangeForecast> ranges;

  HourlyForecast({required this.dateTime, required this.ranges});

  static HourlyForecast fromJson(Map<String, dynamic> json) =>
      _$HourlyForecastFromJson(json);
}
