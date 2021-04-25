import 'package:app/model/models.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class ExpeditionMapPage extends Page {
  final Expedition expedition;
  final DersuRoute route;
  ExpeditionMapPage({required this.expedition, required this.route})
      : super(key: ValueKey("ExpeditionMapPage"));

  Route createRoute(BuildContext context) {
    return MaterialPageRoute(
      settings: this,
      builder: (BuildContext context) {
        return ExpeditionMapScreen(
          expedition: expedition,
          route: route,
        );
      },
    );
  }
}

class ExpeditionMapScreen extends StatelessWidget {
  final Expedition expedition;
  final DersuRoute route;

  ExpeditionMapScreen({required this.expedition, required this.route});

  @override
  Widget build(BuildContext context) {
    final CameraPosition cameraPosition = CameraPosition(
      target: LatLng(this.expedition.latitude, this.expedition.longitude),
      zoom: 14.4746,
    );

    final Set<Circle> circles = Set();
    final Color circleColour = Color(0xddff0000);

    route.points.asMap().forEach((index, point) => {
          circles.add(Circle(
              circleId: CircleId("id-" + index.toString()),
              center: LatLng(point.latitude, point.longitude),
              consumeTapEvents: false,
              radius: 1.0,
              strokeColor: circleColour))
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
