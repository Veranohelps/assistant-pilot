import 'package:app/config/map_config.dart';
import 'package:app/logic/models/route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/plugin_api.dart';
import 'package:latlong2/latlong.dart';

List<LayerOptions> getLayoutOptions(DersuRouteFull route) {
  return <LayerOptions>[
    MapConfig.tilesLayourOptions,
    CircleLayerOptions(
      circles: MapConfig.dots(
        route.coordinate.coordinates
            .map((p) => LatLng(p.latitude, p.longitude))
            .toList(),
      ),
    ),
    CircleLayerOptions(
      circles: MapConfig.waypoints(route.waypoints),
    ),
    PolylineLayerOptions(
      polylines: [
        MapConfig.route(
          route.coordinate.coordinates,
          color: Colors.blue.withOpacity(0.5),
          strokeWidth: 4,
        ),
      ],
    ),
    MarkerLayerOptions(
      markers: [
        MapConfig.startMarker(LatLng(
          route.coordinate.coordinates[0].latitude,
          route.coordinate.coordinates[0].longitude,
        ))
      ],
    ),
    PolylineLayerOptions(
      polylines: [
        MapConfig.route(
          route.coordinate.coordinates,
          color: Colors.cyanAccent,
          strokeWidth: 1,
        ),
      ],
    ),
  ];
}
