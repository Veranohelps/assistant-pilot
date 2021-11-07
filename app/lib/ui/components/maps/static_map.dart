import 'dart:math';

import 'package:animations/animations.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:ionicons/ionicons.dart';
import 'package:latlong2/latlong.dart';

import 'package:app/config/map_config.dart';
import 'package:app/logic/models/route.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';

class StaticMap extends StatelessWidget {
  const StaticMap({
    Key? key,
    required this.route,
  }) : super(key: key);

  final DersuRouteFull route;

  LatLng get mapCameraPoint => LatLng(
        route.coordinate.coordinates[0].latitude,
        route.coordinate.coordinates[0].longitude,
      );

  @override
  Widget build(BuildContext context) {
    return OpenContainer(
      transitionType: ContainerTransitionType.fade,
      transitionDuration: const Duration(milliseconds: 500),
      closedColor: Colors.transparent,
      openElevation: 0,
      closedElevation: 0,
      openBuilder: (BuildContext context, VoidCallback close) {
        return ColoredBox(
          color: Colors.black,
          child: SafeArea(
            bottom: false,
            child: Scaffold(
              body: Stack(
                clipBehavior: Clip.none,
                children: [
                  getMap(),
                  Positioned(
                    right: 5,
                    bottom: max(5, MediaQuery.of(context).padding.bottom),
                    child: BrandButtons.miniIconButton(
                      label: 'exit full screen map',
                      icon: Ionicons.balloon_sharp,
                      onPressed: close,
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
      closedBuilder: (BuildContext _, VoidCallback open) {
        return Stack(
          children: [
            getMap(),
            Positioned(
              right: 5,
              bottom: 5,
              child: BrandButtons.miniIconButton(
                label: 'open full screen map',
                icon: Ionicons.expand_outline,
                onPressed: open,
              ),
            ),
          ],
        );
      },
    );
  }

  Widget getMap([InteractiveFlag? interactiveFlags]) {
    return FlutterMap(
      options: MapOptions(
        bounds: route.boundaries,
        boundsOptions: const FitBoundsOptions(padding: EdgeInsets.all(10)),
        allowPanning: false,
        zoom: MapConfig.staticInitZoom,
        maxZoom: MapConfig.maxZoom,
        minZoom: MapConfig.minZoom,
        // interactiveFlags: InteractiveFlag.none,
      ),
      layers: [
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
      ],
    );
  }
}
