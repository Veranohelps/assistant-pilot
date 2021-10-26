import 'package:app/logic/models/serialization.dart';
import 'package:app/logic/models/weather/range_forecast.dart';
import 'package:json_annotation/json_annotation.dart';

part 'daily_forecast.g.dart';

@JsonSerializable(createToJson: false)
class DayForecast {
  List<RangeForecast> ranges;

  DateTime dateTime;
  @JsonKey(fromJson: Serialization.fromUtcStringToLocal)
  DateTime sunriseDateTime;
  @JsonKey(fromJson: Serialization.fromUtcStringToLocal)
  DateTime sunsetDateTime;

  DayForecast({
    required this.ranges,
    required this.dateTime,
    required this.sunriseDateTime,
    required this.sunsetDateTime,
  });

  static DayForecast fromJson(Map<String, dynamic> json) {
    return _$DayForecastFromJson(json);
  }
}
