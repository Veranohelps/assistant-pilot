import 'dart:io';

import 'package:app/config/get_it_config.dart';
import 'package:app/logic/models/console_message.dart';
import 'package:app/logic/models/waypoint.dart';
import 'package:app/logic/service/waypoint_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_background_geolocation/flutter_background_geolocation.dart'
    as bg;

export 'package:provider/provider.dart';

class GeofenceService extends ChangeNotifier {
  final List<Waypoint> waypoints = [];

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

  Future<void> start(List<Waypoint> waypoints) async {
    await getIt<NotificationService>().init();
    var geofences = waypoints.map((wp) {
      return bg.Geofence(
        identifier: wp.id,
        radius: wp.radiusInMeters.toDouble(),
        latitude: wp.coordinate.latitude.toDouble(),
        longitude: wp.coordinate.longitude.toDouble(),
        notifyOnEntry: true,
        notifyOnDwell: Platform.isAndroid,
        notifyOnExit: true,
        extras: {'waypointId': wp.id},
      );
    }).toList();

    if (geofences.isNotEmpty) {
      await bg.BackgroundGeolocation.addGeofences(geofences);
      getIt<ConsoleService>().addMessage(
          ConsoleMessage(text: '${waypoints.length} waypoints added'));
    }

    this.waypoints.addAll(waypoints);
  }

  Future<void> onWaypointGeofence(Waypoint waypoint, String action) async {
    var notification = getIt<NotificationService>();

    if (action.toLowerCase() == "enter") {
      var description = waypoint.typeIds.isEmpty
          ? ''
          : await WaypointService.getNotificationByTypeId(
              waypoint.typeIds.first);
      notification.showNotification(
          title: waypoint.name, text: description, payload: waypoint.id);
    }

    getIt<ConsoleService>()
        .addMessage(ConsoleMessage(text: '$action: ${waypoint.id}'));
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
    await bg.BackgroundGeolocation.removeListeners();
  }
}
