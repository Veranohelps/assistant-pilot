import 'dart:async';

import 'package:app/config/brand_colors.dart';
import 'package:app/config/geofence.dart';
import 'package:app/config/get_it_config.dart';
import 'package:app/logic/cubits/live/live_cubit.dart';
import 'package:app/logic/get_it/console.dart';
import 'package:app/logic/model/console_message.dart';
import 'package:app/logic/model/expedition.dart';
import 'package:app/logic/model/route.dart';
import 'package:app/logic/services/background_geolocation.dart';
import 'package:app/ui/components/brand_appbar/brand_appbar.dart';
import 'package:flutter/material.dart';
import 'package:app/ui/pages/root_tabs/more/console/console.dart';
import 'package:ionicons/ionicons.dart';

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
    var liveCubit = context.read<LiveCubit>();

    if (widget.isLive) {
      backgroundGeolocation.init();
      backgroundGeolocation.start(widget.expedition.waypoints);
      liveCubit.setLiveOn(
        expedition: widget.expedition,
        route: widget.route,
      );
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

  Widget getConsoleButton() {
    return IconButton(
      onPressed: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (context) => Console(),
          ),
        );
      },
      icon: Icon(
        Ionicons.terminal,
        color: BrandColors.white,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final CameraPosition cameraPosition = CameraPosition(
      target: _mapCameraPoint,
      zoom: zoom,
    );
    return Scaffold(
      appBar: (widget.isLive == false)
          ? BrandAppBar(
              title: Text("Ruta de la expedición"),
              actions: [getConsoleButton()],
            )
          : BrandAppBar(
              title: Text("Live is on"),
              onPop: () => context.read<LiveCubit>().setLiveOff(),
              actions: [getConsoleButton()],
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
