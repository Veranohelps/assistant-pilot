import 'package:app/logic/models/time_with_timezone.dart';
import 'package:app/logic/models/weather/daily_forecast.dart';
import 'package:app/logic/models/weather/hourly_forecast.dart';
import 'package:app/logic/models/weather/meteogram.dart';

import 'package:flutter/material.dart';
import 'package:json_annotation/json_annotation.dart';

part 'weather_forecast.g.dart';

@JsonSerializable(createToJson: false)
@immutable
class WeatherForecast {
  final List<SunCalendarItem> sunCalendar;
  final List<HourlyForecast> forecastHourly;
  final List<Meteogram> meteograms;

  const WeatherForecast({
    required this.sunCalendar,
    required this.forecastHourly,
    required this.meteograms,
  });

  static WeatherForecast fromJson(Map<String, dynamic> json) =>
      _$WeatherForecastFromJson(json);

  List<TimeWithTimeZone> get days {
    final period =
        forecastHourly.last.dateTime.difference(forecastHourly.first.dateTime);

    return List.generate(
      period.inDays,
      (index) => forecastHourly[0].dateTime.add(Duration(days: index)),
    );
  }

  List<HourlyForecast> currentDayHorlyForecast(TimeWithTimeZone dateTime) {
    return forecastHourly
        .where((element) => element.dateTime.isSameDate(dateTime))
        .toList();
  }
}
