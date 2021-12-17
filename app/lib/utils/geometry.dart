import 'dart:math' show sin, cos, pi, asin, atan2;

import 'package:app/logic/models/geo_json.dart';

double degToRad(double degree) {
  return degree * pi / 180;
}

PointCoordinates llFromDistance(
  double latitude,
  double longitude,
  double distanceInKm,
  int bearing,
) {
  const earthRadius = 6378.1; // Radius of the Earth
  final brng = bearing * pi / 180; // Convert bearing to radian
  var lat = latitude * pi / 180; // Current coords to radians
  var lon = longitude * pi / 180;

  // Do the math magic
  lat = asin(sin(lat) * cos(distanceInKm / earthRadius) +
      cos(lat) * sin(distanceInKm / earthRadius) * cos(brng));
  lon += atan2(sin(brng) * sin(distanceInKm / earthRadius) * cos(lat),
      cos(distanceInKm / earthRadius) - sin(lat) * sin(lat));

  // Coords back to degrees and return
  return PointCoordinates(
    latitude: lat * 180 / pi,
    longitude: (lon * 180 / pi),
    altitude: 0,
  );
}

List<PointCoordinates> pointsOnMapCircle(
  double centerLatitude,
  double centerLongitude,
  double distanceInKm,
  int numPoints,
) {
  final points = <PointCoordinates>[];
  for (var i = 0; i <= numPoints - 1; i++) {
    final bearing = ((360 / numPoints) * i).round();
    final newPoints = llFromDistance(
      centerLatitude,
      centerLongitude,
      distanceInKm,
      bearing,
    );
    points.add(newPoints);
  }
  return points;
}
