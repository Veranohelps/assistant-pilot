import 'dart:math' show sin, cos, sqrt, atan2;
import 'package:vector_math/vector_math.dart';
import 'package:geolocator/geolocator.dart';
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

  static Future<LatLng?> getUserLocation(
      [LocationAccuracy? desiredAccuracy]) async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return Future.error('Location services are disabled.');
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return Future.error('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      return Future.error(
          'Location permissions are permanently denied, we cannot request permissions.');
    }
    Position position = await Geolocator.getCurrentPosition(
      desiredAccuracy: desiredAccuracy ?? LocationAccuracy.best,
    );

    LatLng latLng = LatLng(position.latitude, position.longitude);
    return latLng;
  }

  static double getDistanceGeolocator(LatLng latLng, LatLng latLng1) {
    var d = Geolocator.distanceBetween(
        latLng.latitude, latLng.longitude, latLng1.latitude, latLng1.longitude);
    if (d < 0) {
      d = d * -1;
    }
    return d;
  }
}
