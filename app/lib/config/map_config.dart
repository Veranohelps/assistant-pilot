import 'package:app/logic/models/geo_json.dart';
import 'package:app/logic/models/waypoint.dart';
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

  static Polyline route(
    List<PointCoordinates> points, {
    required Color color,
    required double strokeWidth,
  }) {
    return Polyline(
      points: points.map((p) => LatLng(p.latitude, p.longitude)).toList(),
      strokeWidth: strokeWidth,
      color: color,
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

  static List<CircleMarker> waypoints(List<Waypoint> list) {
    return list
        .map(
          (waypoint) => CircleMarker(
            radius: waypoint.radiusInMeters.toDouble(),
            useRadiusInMeter: true,
            point: LatLng(
                waypoint.coordinate.latitude, waypoint.coordinate.longitude),
            color: BrandColors.red.withOpacity(0.5),
            borderStrokeWidth: 0,
          ),
        )
        .toList();
  }
}
