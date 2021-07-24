import 'dart:async';

import 'package:app/config/brand_colors.dart';
import 'package:app/config/geofence.dart';
import 'package:app/config/get_it_config.dart';
import 'package:app/logic/get_it/console.dart';
import 'package:app/logic/model/console_message.dart';
import 'package:app/logic/model/expedition.dart';
import 'package:app/logic/model/route.dart';
import 'package:app/logic/services/background_geolocation.dart';
import 'package:flutter/material.dart';
import 'package:app/ui/pages/root_tabs/more/console/console.dart';

import 'package:google_maps_flutter/google_maps_flutter.dart';

const zoom = 14.4746;

class ExpeditionMapWidget extends StatefulWidget {
  ExpeditionMapWidget({
    required this.isLive,
    required this.expedition,
    required this.route,
  });

  final Expedition expedition;
  final DersuRoute route;
  final bool isLive;

  @override
  State<StatefulWidget> createState() => MapPageState();
}

class MapPageState extends State<ExpeditionMapWidget> {
  late LatLng _mapCameraPoint;
  Completer<GoogleMapController> _controller = new Completer();
  final Set<Circle> _mapCircles = Set();

  @override
  void initState() {
    super.initState();
    _mapCameraPoint = LatLng(
      widget.expedition.location.latitude,
      widget.expedition.location.longitude,
    );

    widget.expedition.waypoints.forEach((waypoint) => {
          _mapCircles.add(
            Circle(
              circleId: CircleId("waypoint-id-" + waypoint.id),
              center: LatLng(waypoint.latitude, waypoint.longitude),
              // radius: waypoint.radiusInMeters,
              radius: kGeofenceCircleRadius,
              fillColor: BrandColors.greenWithOpacity,
              strokeWidth: 0,
              consumeTapEvents: true,
              onTap: () => {
                getIt<ConsoleService>().addMessage(
                  ConsoleMessage(
                    text: 'Waypoint has been tapped',
                  ),
                )
              },
            ),
          )
        });

    widget.route.points.asMap().forEach((index, point) => {
          _mapCircles.add(
            Circle(
              circleId: CircleId("id-" + index.toString()),
              center: LatLng(point.latitude, point.longitude),
              consumeTapEvents: false,
              radius: 5.0,
              fillColor: BrandColors.redWithOpacity,
              strokeWidth: 0,
            ),
          )
        });

    WidgetsBinding.instance!.addPostFrameCallback(_afterLayout);
  }

  Future<void> _afterLayout(_) async {
    backgroundGeolocation = context.read<BackgroundGeolocation>();

    if (widget.isLive) {
      backgroundGeolocation.init();
      backgroundGeolocation.start(widget.expedition.waypoints);
    }
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
    final CameraPosition cameraPosition = CameraPosition(
      target: _mapCameraPoint,
      zoom: zoom,
    );

    return Scaffold(
      appBar: (widget.isLive == false)
          ? AppBar(
              title: Text("Ruta de la expedición"),
              actions: [
                IconButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => Console(),
                      ),
                    );
                  },
                  icon: Icon(Icons.account_balance_rounded),
                )
              ],
            )
          : AppBar(
              title: Text(
                "Live is on",
              ),
              actions: [
                IconButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => Console(),
                      ),
                    );
                  },
                  icon: Icon(Icons.account_balance_rounded),
                )
              ],
            ),
      body: GoogleMap(
        mapType: MapType.satellite,
        initialCameraPosition: cameraPosition,
        circles: _mapCircles,
        onMapCreated: (GoogleMapController controller) async {
          _controller.complete(controller);
        },
        trafficEnabled: false,
        tiltGesturesEnabled: false,
        indoorViewEnabled: false,
        compassEnabled: false,
        buildingsEnabled: false,
        myLocationButtonEnabled: widget.isLive,
        myLocationEnabled: widget.isLive,
        scrollGesturesEnabled: true,
        zoomControlsEnabled: true,
        zoomGesturesEnabled: true,
      ),
    );
  }
}
