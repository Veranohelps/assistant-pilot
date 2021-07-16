import 'dart:async';

import 'package:app/logic/model/waypoint.dart';
import 'package:app/logic/services/background_geolocation.dart';
import 'package:app/utils/extensions/text_extension.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class TestingGeofence extends StatefulWidget {
  const TestingGeofence({Key? key}) : super(key: key);

  @override
  _TestingGeofenceState createState() => _TestingGeofenceState();
}

class _TestingGeofenceState extends State<TestingGeofence> {
  Completer<GoogleMapController> _controller = Completer();
  Set<Marker> markers = {};
  final CameraPosition _kGooglePlex = CameraPosition(
    target: LatLng(37.42796133580664, -122.085749655962),
    zoom: 14.4746,
  );

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance!.addPostFrameCallback(_afterLayout);
  }

  Future<void> _afterLayout(_) async {
    backgroundGeolocation = context.read<BackgroundGeolocation>()..init();
  }

  late BackgroundGeolocation backgroundGeolocation;

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: AppBar(
        title: Text('Testing'),
      ),
      body: Stack(
        children: [
          GoogleMap(
            markers: markers,
            mapType: MapType.normal,
            initialCameraPosition: _kGooglePlex,
            myLocationButtonEnabled: true,
            myLocationEnabled: true,
            onTap: (value) async {
              if (markers.length > 0) {
                markers.clear();
              }
              setState(() {
                markers.add(
                  Marker(
                    position: value,
                    icon: BitmapDescriptor.defaultMarker,
                    markerId: MarkerId('pin'),
                  ),
                );
              });

              SharedPreferences prefs = await SharedPreferences.getInstance();
              await prefs.setDouble('lat', value.latitude);
              await prefs.setDouble('lon', value.longitude);
            },
            onMapCreated: (GoogleMapController controller) {
              _controller.complete(controller);
            },
          ),
          if (markers.length > 0)
            Positioned(
              left: 20,
              bottom: 50,
              child: GestureDetector(
                onTap: () async {
                  await backgroundGeolocation.removeGeofences();
                  if (markers.length > 0) {
                    Marker maker = markers.first;

                    backgroundGeolocation.start([
                      Waypoint(
                        id: 'testing',
                        name: 'testing',
                        description:
                            '${maker.position.latitude} ${maker.position.longitude}',
                        type: 'type-test',
                        radiusInMeters: 200,
                        latitude: maker.position.latitude,
                        longitude: maker.position.longitude,
                        altitude: 0,
                      ),
                    ]);
                  }
                },
                child: Container(
                  padding: EdgeInsets.all(8),
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                      color: Colors.blue,
                      borderRadius: BorderRadius.circular(10)),
                  child: Text(
                    'Save',
                  ).h3.withColor(Colors.white),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
