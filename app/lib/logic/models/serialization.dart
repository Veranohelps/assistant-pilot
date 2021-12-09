import 'package:app/logic/models/time_with_timezone.dart';
import 'package:app/utils/extensions/lat_lng_bounds.dart';
import 'package:flutter_map/flutter_map.dart';

import 'estimation.dart';

// ignore: prefer_void_to_null
Null readonly(_) => null;

class Serialization {
  static const Function readOnly = readonly;

  static List<Estimation> fromJsonMapToEsitmationList(
      Map<String, dynamic> json) {
    return json.values.map((object) => Estimation.fromJson(object)).toList();
  }

  static Duration fromMinutesToDuration(double number) {
    return Duration(minutes: number.toInt());
  }

  static LatLngBounds fromJsonToLatLngBounds(Map<String, dynamic> json) {
    return LatLngBoundsExt.fromJson(json);
  }

  static Map<String, dynamic> fromLatLngBoundsToJson(
      LatLngBounds latLngBounds) {
    return latLngBounds.toJson();
  }

  static List<int> rangeFromString(String rangeString) {
    var firstNumberLessThenZero = false;
    if (rangeString[0] == '-') {
      firstNumberLessThenZero = true;
      rangeString = rangeString.substring(1);
    }

    var arr = rangeString.split('-');
    var from = int.parse(arr[0]);
    var to = int.parse(arr[1]);
    return [from * (firstNumberLessThenZero ? -1 : 1), to];
  }

  static DateTime fromUtcStringToLocal(String utc) {
    return DateTime.parse(utc);
  }

  static String fromTimeWithTimeZoneToString(
      TimeWithTimeZone timeWithTimeZone) {
    return timeWithTimeZone.toUtc().toString();
  }
}
