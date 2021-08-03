import 'dart:io';

import 'package:app/config/get_it_config.dart';
import 'package:app/logic/model/console_message.dart';
import 'package:app/logic/model/waypoint.dart';
import 'package:flutter/material.dart';
import 'package:flutter_background_geolocation/flutter_background_geolocation.dart'
    as bg;

export 'package:provider/provider.dart';

class BackgroundGeolocation extends ChangeNotifier {
  final List<Waypoint> waypoints = [];
  final List<String> shownWaypointsIds = [];
  Future<bg.Location> get currentPosition =>
      bg.BackgroundGeolocation.getCurrentPosition();

  Future<void> requestPermissionTillAlwais() async {
    while (true) {
      var status = await bg.BackgroundGeolocation.requestPermission();

      if (status == bg.ProviderChangeEvent.AUTHORIZATION_STATUS_ALWAYS) {
        break;
      }
    }
  }

  Future<void> init() async {
    await bg.BackgroundGeolocation.destroyLocations();
    await bg.BackgroundGeolocation.removeGeofences();

    bg.BackgroundGeolocation.onGeofence(
      (bg.GeofenceEvent event) {
        var waypointId = event.extras!['waypointId'];
        var waypoint =
            waypoints.firstWhere((element) => element.id == waypointId);
        onWaypointGeofence(waypoint, event.action);
      },
    );

    await bg.BackgroundGeolocation.ready(bg.Config(
            desiredAccuracy: bg.Config.DESIRED_ACCURACY_HIGH,
            distanceFilter: 10.0,
            stopOnTerminate: false,
            startOnBoot: true,
            debug: false,
            logLevel: bg.Config.LOG_LEVEL_VERBOSE))
        .then((bg.State state) {
      if (!state.enabled) {
        bg.BackgroundGeolocation.start();
      }
    });

    getIt<ConsoleService>().addMessage(
      ConsoleMessage(text: 'geofence init'),
    );
  }

  Future<void> start(List<Waypoint> waypoints, int waypointPrecision) async {
    getIt<NotificationService>().init();
    var geofences = waypoints.map((wp) {
      return bg.Geofence(
        identifier: wp.id,
        radius: waypointPrecision.toDouble(),
        latitude: wp.latitude,
        longitude: wp.longitude,
        notifyOnEntry: true,
        notifyOnDwell: Platform.isAndroid,
        notifyOnExit: true,
        extras: {'waypointId': wp.id},
      );
    }).toList();
    await bg.BackgroundGeolocation.addGeofences(geofences);

    getIt<ConsoleService>().addMessage(
        ConsoleMessage(text: '${waypoints.length} waypoints added'));

    this.waypoints.addAll(waypoints);
  }

  Future<void> onWaypointGeofence(Waypoint waypoint, String action) async {
    var notification = getIt<NotificationService>();

    if (action.toLowerCase() == "enter") {
      notification.showNotification(
        title: '$action: ${waypoint.name}, ${waypoint.type}',
        text: waypoint.description,
      );
    }

    getIt<ConsoleService>()
        .addMessage(ConsoleMessage(text: '$action: ${waypoint.id}'));
    shownWaypointsIds.add(waypoint.id);
    // bg.BackgroundGeolocation.removeGeofence(waypoint.id);
    // notifyListeners();
  }

  Future<void> removeGeofences() async {
    await bg.BackgroundGeolocation.removeGeofences();
  }

  Future<void> stop() async {
    getIt<ConsoleService>().addMessage(ConsoleMessage(
        text: 'BackgroundGeolocation stopped, Geofences cleared'));
    await bg.BackgroundGeolocation.stop();

    await bg.BackgroundGeolocation.destroyLocations();
    await bg.BackgroundGeolocation.removeGeofences();
  }
}
