import 'dart:math' show sin, cos, sqrt, atan2;
import 'package:vector_math/vector_math.dart';
import 'package:latlong2/latlong.dart';

double earthRadius = 6371000;

class GeoUtils {
  static double getDistance(LatLng latLng, LatLng latLng1) {
    var dLat = radians(latLng.latitude - latLng1.latitude);
    var dLng = radians(latLng.longitude - latLng1.longitude);
    var a = sin(dLat / 2) * sin(dLat / 2) +
        cos(radians(latLng1.latitude)) *
            cos(radians(latLng.latitude)) *
            sin(dLng / 2) *
            sin(dLng / 2);
    var c = 2 * atan2(sqrt(a), sqrt(1 - a));
    var d = earthRadius * c;
    if (d < 0) {
      d = d * -1;
    }
    return d;
  }
}
