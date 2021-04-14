import 'package:app/model/expedition.dart';
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class ExpeditionMapPage extends Page {
  final Expedition expedition;
  ExpeditionMapPage({required this.expedition})
      : super(key: ValueKey(expedition.toString() + "-show-map"));

  Route createRoute(BuildContext context) {
    return MaterialPageRoute(
      settings: this,
      builder: (BuildContext context) {
        return ExpeditionMapScreen(
          expedition: expedition,
        );
      },
    );
  }
}

class ExpeditionMapScreen extends StatelessWidget {
  final Expedition expedition;

  ExpeditionMapScreen({
    required this.expedition,
  });

  @override
  Widget build(BuildContext context) {
    final CameraPosition cameraPosition = CameraPosition(
      target: LatLng(this.expedition.latitude, this.expedition.longitude),
      zoom: 14.4746,
    );

    return Scaffold(
      appBar: AppBar(title: Text("Expedition Map")),
      body: Container(
        height: double.infinity,
        width: double.infinity,
        child: GoogleMap(
            mapType: MapType.hybrid, initialCameraPosition: cameraPosition),
      ),
    );
  }
}
