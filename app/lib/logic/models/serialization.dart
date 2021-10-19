import 'package:app/utils/extensions/lat_lng_bounds.dart';
import 'package:flutter_map/flutter_map.dart';

Null readonly(_) => null;

class Serialization {
  static const Function readOnly = readonly;

  static LatLngBounds fromJsonToLatLngBounds(Map<String, dynamic> json) {
    return LatLngBoundsExt.fromJson(json);
  }

  static Map<String, dynamic> fromLatLngBoundsToJson(
      LatLngBounds latLngBounds) {
    return latLngBounds.toJson();
  }
}
