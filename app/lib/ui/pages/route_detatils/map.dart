import 'dart:async';

import 'package:app/config/brand_colors.dart';
import 'package:app/logic/models/route.dart';
import 'package:app/logic/services/background_geolocation.dart';
import 'package:app/ui/pages/console/console.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:ionicons/ionicons.dart';

class StaticMap extends StatefulWidget {
  StaticMap({required this.route});

  final DersuRouteFull route;

  @override
  State<StatefulWidget> createState() => StaticMapState();
}

class StaticMapState extends State<StaticMap> {
  final zoom = 15.0;

  Completer<GoogleMapController> _controller = new Completer();
  final Set<Circle> _mapCircles = Set();
  CameraPosition? cameraPosition;
  @override
  void initState() {
    super.initState();
    cameraPosition = CameraPosition(
      target: LatLng(
        widget.route.coordinate.coordinates.first.latitude.toDouble(),
        widget.route.coordinate.coordinates.first.longitude.toDouble(),
      ),
      zoom: zoom,
    );
    widget.route.coordinate.coordinates.asMap().forEach((index, point) => {
          _mapCircles.add(
            Circle(
              circleId: CircleId("id-" + index.toString()),
              center: LatLng(
                point.latitude.toDouble(),
                point.longitude.toDouble(),
              ),
              consumeTapEvents: false,
              radius: 5.0,
              fillColor: BrandColors.blue,
              strokeWidth: 0,
            ),
          )
        });

    WidgetsBinding.instance!.addPostFrameCallback(_afterLayout);
  }

  Future<void> _afterLayout(_) async {
    backgroundGeolocation = context.read<BackgroundGeolocation>();
  }

  late BackgroundGeolocation backgroundGeolocation;

  @override
  void dispose() {
    backgroundGeolocation.stop();
    disposeMap();
    super.dispose();
  }

  Future<void> disposeMap() async {
    final GoogleMapController controller = await _controller.future;
    controller.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return cameraPosition == null && _controller.isCompleted
        ? Center(
            child: CircularProgressIndicator(
            color: BrandColors.blue,
          ))
        : GoogleMap(
            mapType: MapType.satellite,
            initialCameraPosition: cameraPosition!,
            circles: _mapCircles,
            onMapCreated: (GoogleMapController controller) async {
              _controller.complete(controller);
            },
            trafficEnabled: false,
            tiltGesturesEnabled: false,
            indoorViewEnabled: false,
            compassEnabled: false,
            buildingsEnabled: false,
            myLocationButtonEnabled: false,
            myLocationEnabled: false,
            scrollGesturesEnabled: true,
            zoomControlsEnabled: false,
            zoomGesturesEnabled: false,
          );
  }
}
