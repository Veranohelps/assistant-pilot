import 'dart:async';

import 'package:app/maths/haver_sine.dart';
import 'package:app/model/models.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:location/location.dart';

final CAMERA_ZOOM = 14.4746;

class ExpeditionMapPage extends Page {
  final Expedition expedition;
  final DersuRoute route;
  final bool live;
  final onWaypointTapped;
  final handleExpeditionStop;

  ExpeditionMapPage(
      {required this.live,
      required this.expedition,
      required this.route,
      required this.onWaypointTapped,
      required this.handleExpeditionStop})
      : super(key: ValueKey("ExpeditionMapPage-" + live.toString()));

  Route createRoute(BuildContext context) {
    return MaterialPageRoute(
      settings: this,
      builder: (BuildContext context) {
        return ExpeditionMapWidget(
          live: live,
          expedition: expedition,
          route: route,
          onWaypointTapped: onWaypointTapped,
          handleExpeditionStop: handleExpeditionStop,
        );
      },
    );
  }
}

class ExpeditionMapWidget extends StatefulWidget {
  final Expedition expedition;
  final DersuRoute route;
  final bool live;
  final onWaypointTapped;
  final handleExpeditionStop;

  ExpeditionMapWidget(
      {required this.live,
      required this.expedition,
      required this.route,
      required this.onWaypointTapped,
      required this.handleExpeditionStop})
      : super(key: ValueKey("ExpeditionMapPage"));

  @override
  State<StatefulWidget> createState() => MapPageState(
      live: live,
      expedition: expedition,
      route: route,
      onWaypointTapped: onWaypointTapped,
      handleExpeditionStop: handleExpeditionStop);
}

class MapPageState extends State<ExpeditionMapWidget> {
  final live;
  final Expedition expedition;
  final DersuRoute route;
  final onWaypointTapped;
  final handleExpeditionStop;
  LocationData? currentLocation;
  Location? location;
  bool _serviceEnabled = false;
  PermissionStatus? _permissionStatus;
  LatLng? _mapCameraPoint;
  Completer<GoogleMapController> _controller = new Completer();
  final Set<Circle> _mapCircles = Set();
  StreamSubscription<LocationData>? locationSubscription;

  MapPageState(
      {required this.live,
      required this.expedition,
      required this.route,
      required this.onWaypointTapped,
      required this.handleExpeditionStop});

  @override
  void initState() {
    super.initState();
    _mapCameraPoint = LatLng(expedition.latitude, expedition.longitude);
    location = new Location();
    setInitialLocation();
  }

  @override
  void dispose() {
    if (locationSubscription != null) {
      locationSubscription!.cancel();
    }
    disposeMap();
    super.dispose();
  }

  Future<void> disposeMap() async {
    final GoogleMapController controller = await _controller.future;
    controller.dispose();
  }

  void setInitialLocation() async {
    _serviceEnabled = await location!.serviceEnabled();
    if (!_serviceEnabled) {
      _serviceEnabled = await location!.requestService();
      if (!_serviceEnabled) {
        print(">>>>>>>>>>>>>>> Could NOT enable location service!!");
        return;
      } else {
        print("Location service enabled now");
      }
    } else {
      print("Location service already enabled");
    }

    _permissionStatus = await location!.hasPermission();
    if (_permissionStatus == PermissionStatus.denied) {
      _permissionStatus = await location!.requestPermission();
      if (_permissionStatus != PermissionStatus.granted) {
        return;
      }
    }

    locationSubscription =
        location!.onLocationChanged.listen((LocationData locationData) {
      if (live == true) {
        expedition.waypoints.forEach((waypoint) {
          var distanceInKms = HaverSine.getDistanceFromLatLonInKm(
              waypoint.point.latitude,
              waypoint.point.longitude,
              locationData.latitude,
              locationData.longitude);

          if (distanceInKms * 1000 <= waypoint.radiusInMeters) {
            onWaypointTapped(context, waypoint);
          }
        });
      }

      setState(() {
        currentLocation = locationData;
        showCurrentLocationOnMap();
      });
    });

    currentLocation = await location!.getLocation();
  }

  void centreCurrentLocation() async {
    if (currentLocation == null) {
      print("We don't have current location, please try later");
    } else {
      print("Centre map in current location");

      final LatLng currentLatLng =
          LatLng(currentLocation!.latitude!, currentLocation!.longitude!);
      final GoogleMapController controller = await _controller.future;
      controller.animateCamera(CameraUpdate.newCameraPosition(
          CameraPosition(target: currentLatLng, zoom: CAMERA_ZOOM)));

      setState(() {
        _mapCameraPoint = currentLatLng;
      });
    }
  }

  void showRouteOnMap() {
    final Color circleColour = Color(0xddff0000);
    final Color waypointColour = Color(0xdd00ff00);

    route.points.asMap().forEach((index, point) => {
          _mapCircles.add(Circle(
              circleId: CircleId("id-" + index.toString()),
              center: LatLng(point.latitude, point.longitude),
              consumeTapEvents: false,
              radius: 5.0,
              fillColor: circleColour,
              strokeWidth: 0))
        });

    expedition.waypoints.asMap().forEach((index, waypoint) => {
          _mapCircles.add(Circle(
              circleId: CircleId("waypoint-id-" + index.toString()),
              center: LatLng(waypoint.point.latitude, waypoint.point.longitude),
              radius: 30.0,
              fillColor: waypointColour,
              strokeWidth: 0,
              consumeTapEvents: true,
              onTap: () => onWaypointTapped(context, waypoint)))
        });
  }

  void showCurrentLocationOnMap() {
    final Color currentLocationColour = Color(0xcc0000ff);

    if (currentLocation != null) {
      _mapCircles.add(Circle(
          circleId: CircleId("current-location"),
          center:
              LatLng(currentLocation!.latitude!, currentLocation!.longitude!),
          radius: 15.0,
          fillColor: currentLocationColour,
          strokeWidth: 0,
          consumeTapEvents: false));
    } else {
      print(
          "Current location was not available at the time of building the map");
    }
  }

  @override
  Widget build(BuildContext context) {
    final CameraPosition cameraPosition = CameraPosition(
      target: _mapCameraPoint!,
      zoom: CAMERA_ZOOM,
    );

    return Scaffold(
        appBar: (live == false)
            ? AppBar(title: Text("Ruta de la expedición"))
            : null,
        body: SafeArea(
            child: Stack(
          children: [
            Container(
                height: double.infinity,
                width: double.infinity,
                child: GoogleMap(
                  mapType: MapType.satellite,
                  initialCameraPosition: cameraPosition,
                  circles: _mapCircles,
                  onMapCreated: (GoogleMapController controller) {
                    _controller.complete(controller);
                    showRouteOnMap();
                    showCurrentLocationOnMap();
                  },
                  trafficEnabled: false,
                  tiltGesturesEnabled: false,
                  indoorViewEnabled: false,
                  compassEnabled: false,
                  buildingsEnabled: false,
                  // liteModeEnabled: true,
                )),
            Row(
              children: [
                ElevatedButton(
                    onPressed: centreCurrentLocation,
                    child: Text("Posición Actual")),
                if (live == true)
                  ElevatedButton(
                      style: ElevatedButton.styleFrom(primary: Colors.red),
                      onPressed: () => handleExpeditionStop(context),
                      child: Text("STOP"))
              ],
            )
          ],
        )));
  }
}
