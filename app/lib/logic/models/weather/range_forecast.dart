import 'package:app/logic/models/serialization.dart';
import 'package:app/logic/models/weather/hourly_forecast.dart';
import 'package:json_annotation/json_annotation.dart';

part 'range_forecast.g.dart';

@JsonSerializable(createToJson: false)
class RangeForecast {
  @JsonKey(fromJson: Serialization.rangeFromString)
  final List<int> range;

  final List<HourlyForecast> forecastHourly;

  RangeForecast({
    required this.range,
    required this.forecastHourly,
  });

  static RangeForecast fromJson(Map<String, dynamic> json) =>
      _$RangeForecastFromJson(json);
}
