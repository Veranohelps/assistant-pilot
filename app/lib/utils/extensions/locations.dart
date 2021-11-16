import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:flutter_background_geolocation/flutter_background_geolocation.dart';

extension LocationExt on Location {
  toLatLong() {
    return LatLng(coords.latitude, coords.longitude);
  }
}

extension MapControllerExt on MapController {
  bool moveToLocation(Location l, double z) => move(l.toLatLong(), z);

  MoveAndRotateResult moveAndRotateToLocation(Location l, double z, double d) =>
      moveAndRotate(l.toLatLong(), z, d);
}
