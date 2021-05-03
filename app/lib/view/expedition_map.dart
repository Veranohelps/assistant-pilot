import 'package:app/model/models.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class ExpeditionMapPage extends Page {
  final Expedition expedition;
  final DersuRoute route;
  final waypointTapped;
  ExpeditionMapPage(
      {required this.expedition,
      required this.route,
      required this.waypointTapped})
      : super(key: ValueKey("ExpeditionMapPage"));

  Route createRoute(BuildContext context) {
    return MaterialPageRoute(
      settings: this,
      builder: (BuildContext context) {
        return ExpeditionMapScreen(
          expedition: expedition,
          route: route,
          waypointTapped: waypointTapped,
        );
      },
    );
  }
}

class ExpeditionMapScreen extends StatelessWidget {
  final Expedition expedition;
  final DersuRoute route;
  final waypointTapped;

  ExpeditionMapScreen(
      {required this.expedition,
      required this.route,
      required this.waypointTapped});

  @override
  Widget build(BuildContext context) {
    final CameraPosition cameraPosition = CameraPosition(
      target: LatLng(this.expedition.latitude, this.expedition.longitude),
      zoom: 14.4746,
    );

    final Set<Circle> circles = Set();
    final Color circleColour = Color(0xddff0000);
    final Color waypointColour = Color(0xdd00ff00);

    route.points.asMap().forEach((index, point) => {
          circles.add(Circle(
              circleId: CircleId("id-" + index.toString()),
              center: LatLng(point.latitude, point.longitude),
              consumeTapEvents: false,
              radius: 5.0,
              fillColor: circleColour,
              strokeWidth: 0))
        });

    expedition.waypoints.asMap().forEach((index, waypoint) => {
          circles.add(Circle(
              circleId: CircleId("waypoint-id-" + index.toString()),
              center: LatLng(waypoint.point.latitude, waypoint.point.longitude),
              radius: 30.0,
              fillColor: waypointColour,
              strokeWidth: 0,
              consumeTapEvents: true,
              onTap: () => waypointTapped(context, waypoint)))
        });

    return Scaffold(
      appBar: AppBar(title: Text("Expedition Map")),
      body: Container(
          height: double.infinity,
          width: double.infinity,
          child: GoogleMap(
              mapType: MapType.hybrid,
              initialCameraPosition: cameraPosition,
              circles: circles)),
    );
  }
}
