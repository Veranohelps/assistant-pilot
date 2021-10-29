import 'package:json_annotation/json_annotation.dart';

import 'package:app/logic/models/time_with_timezone.dart';

part 'daily_forecast.g.dart';

@JsonSerializable(createToJson: false)
class SunCalendarItem {
  @JsonKey(fromJson: TimeWithTimeZone.parse)
  TimeWithTimeZone dateTime;

  @JsonKey(fromJson: TimeWithTimeZone.parse)
  TimeWithTimeZone sunriseDateTime;

  @JsonKey(fromJson: TimeWithTimeZone.parse)
  TimeWithTimeZone sunsetDateTime;

  @JsonKey(fromJson: TimeWithTimeZone.parse)
  TimeWithTimeZone moonriseDateTime;

  @JsonKey(fromJson: TimeWithTimeZone.parse)
  TimeWithTimeZone moonsetDatetime;

  String moonPhaseName;

  SunCalendarItem({
    required this.dateTime,
    required this.sunriseDateTime,
    required this.sunsetDateTime,
    required this.moonriseDateTime,
    required this.moonsetDatetime,
    required this.moonPhaseName,
  });

  static SunCalendarItem fromJson(Map<String, dynamic> json) {
    return _$SunCalendarItemFromJson(json);
  }
}
