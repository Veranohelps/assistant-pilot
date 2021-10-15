import 'package:flutter/material.dart';
import 'package:flutter_config/flutter_config.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:ionicons/ionicons.dart';
import 'package:latlong2/latlong.dart';

import 'brand_colors.dart';

class MapConfig {
  static const staticInitZoom = 14.5;
  static const liveInitZoom = 16.5;

  static const maxZoom = 18.0;
  static const minZoom = 7.0;

  static final tilesLayourOptions = TileLayerOptions(
    urlTemplate:
        "https://tile.thunderforest.com/outdoors/{z}/{x}/{y}@2x.png?apikey=${FlutterConfig.get('THUNDER_FOREST_API')}",
  );

  static Marker startMarker(LatLng point) {
    return Marker(
      width: 30.0,
      height: 30.0,
      point: point,
      builder: (ctx) => Padding(
        padding: const EdgeInsets.only(bottom: 12, left: 12),
        child: Icon(
          Ionicons.flag_outline,
          color: Colors.black,
          size: 18,
        ),
      ),
    );
  }

  static Polyline route(List<LatLng> points) {
    return Polyline(
      points: points,
      strokeWidth: 4,
      color: Colors.blue.withOpacity(0.5),
    );
  }

  static List<CircleMarker> dots(List<LatLng> list) {
    return list
        .map(
          (point) => CircleMarker(
            radius: 8,
            useRadiusInMeter: true,
            point: point,
            color: BrandColors.red,
            borderStrokeWidth: 0,
          ),
        )
        .toList();
  }
}
