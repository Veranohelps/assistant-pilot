import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

extension LatLngBoundsExt on LatLngBounds {
  Map<String, dynamic> toJson() {
    return {
      'nw': [northWest.longitude, northWest.latitude],
      'se': [southEast.longitude, southEast.latitude],
    };
  }

  static LatLngBounds fromJson(Map<String, dynamic> json) {
    return LatLngBounds(
      LatLng(json['nw'][1], json['nw'][0]),
      LatLng(json['se'][1], json['se'][0]),
    );
  }
}
