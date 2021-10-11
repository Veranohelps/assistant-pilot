import 'package:app/config/map_config.dart';
import 'package:app/logic/models/route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

class StaticMap extends StatelessWidget {
  StaticMap({required this.route});

  final DersuRouteFull route;

  LatLng get mapCameraPoint => LatLng(
        route.coordinate.coordinates[0].latitude,
        route.coordinate.coordinates[0].longitude,
      );

  @override
  Widget build(BuildContext context) {
    print(DateTime.now());
    return FlutterMap(
      options: MapOptions(
        allowPanning: false,
        center: mapCameraPoint,
        zoom: MapConfig.initZoom,
        maxZoom: MapConfig.maxZoom,
        minZoom: MapConfig.minZoom,
        // interactiveFlags: InteractiveFlag.none,
      ),
      layers: [
        MapConfig.tilesLayourOptions,
        PolylineLayerOptions(
          polylines: [
            MapConfig.route(
              route.coordinate.coordinates
                  .map((p) => LatLng(p.latitude, p.longitude))
                  .toList(),
            ),
          ],
        ),
        CircleLayerOptions(
          circles: MapConfig.dots(
            route.coordinate.coordinates
                .map((p) => LatLng(p.latitude, p.longitude))
                .toList(),
          ),
        ),
        MarkerLayerOptions(
          markers: [
            MapConfig.startMarker(LatLng(
              route.coordinate.coordinates[0].latitude,
              route.coordinate.coordinates[0].longitude,
            ))
          ],
        ),
      ],
    );
  }
}
