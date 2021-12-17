import 'dart:io';

import 'package:app/config/get_it_config.dart';
import 'package:app/logic/models/console_message.dart';
import 'package:app/logic/models/expedition_event.dart';
import 'package:app/logic/models/geo_json.dart';
import 'package:app/logic/models/waypoint.dart';
import 'package:app/logic/service/expedition_log.dart';
import 'package:app/logic/service/waypoint_service.dart';
import 'package:app/utils/geometry.dart';
import 'package:app/utils/string_generators.dart';
import 'package:flutter/material.dart';
import 'package:flutter_background_geolocation/flutter_background_geolocation.dart'
    as bg;

export 'package:provider/provider.dart';

class GeofenceTypes {
  static String get waypoint => 'waypoint';
  static String get technical => 'technical';
}

class GeofenceService extends ChangeNotifier {
  final List<Waypoint> waypoints = [];
  final List<String> technicalWaypointsIds = [];
  late ExpeditionLogService expeditionLogService;

  Future<void> init() async {
    await bg.BackgroundGeolocation.destroyLocations();
    await bg.BackgroundGeolocation.removeGeofences();

    bg.BackgroundGeolocation.onGeofence(
      (bg.GeofenceEvent event) async {
        if (event.extras?['type'] == GeofenceTypes.waypoint) {
          var waypointId = event.extras!['waypointId'];
          var waypoint =
              waypoints.firstWhere((element) => element.id == waypointId);
          onWaypointGeofence(waypoint, event.action);
          expeditionLogService.ping(ExpeditionEvent(
            type: ExpeditionEventType.waypoint,
            dateTime: DateTime.now(),
            coordinates: PointCoordinates(
              latitude: event.location.coords.latitude,
              longitude: event.location.coords.longitude,
              altitude: event.location.coords.altitude,
            ),
          ));
        } else if (event.extras?['type'] == GeofenceTypes.technical) {
          print('[tracking user]: on geofence: $event');

          await _removeTechnicalWaypoints();
          var center = await bg.BackgroundGeolocation.getCurrentPosition();
          await _createTechnicalWaypoints(center);
          expeditionLogService.ping(ExpeditionEvent(
            type: ExpeditionEventType.location,
            dateTime: DateTime.now(),
            coordinates: PointCoordinates(
              latitude: center.coords.latitude,
              longitude: center.coords.longitude,
              altitude: center.coords.altitude,
            ),
          ));

          getIt<ConsoleService>().addMessage(
            ConsoleMessage(
              text:
                  '[user]: ${center.coords.latitude}, ${center.coords.longitude}',
            ),
          );
        }
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

  Future<void> _createTechnicalWaypoints(bg.Location center) async {
    print('[tracking user]: create waypoints');

    const pointCount = 5;
    const distanceInKm = 4.0;

    var points = pointsOnMapCircle(
      center.coords.latitude,
      center.coords.longitude,
      distanceInKm,
      pointCount,
    );
    var geofences = points.map((p) {
      var identifier = StringGenerators.randomId();
      technicalWaypointsIds.add(identifier);
      return bg.Geofence(
        identifier: identifier,
        radius: 2800,
        latitude: p.latitude,
        longitude: p.longitude,
        notifyOnEntry: true,
        notifyOnDwell: true,
        notifyOnExit: true,
        extras: {'type': GeofenceTypes.technical},
      );
    }).toList();

    await bg.BackgroundGeolocation.addGeofences(geofences);
  }

  Future<void> _removeTechnicalWaypoints() async {
    print('[tracking user]: remove waypoints');

    var futures = technicalWaypointsIds
        .map((id) => bg.BackgroundGeolocation.removeGeofence(id));
    await Future.wait(futures);
    technicalWaypointsIds.clear();
  }

  Future<void> startTrackExpedition(
    String expeditionId,
    List<Waypoint> waypoints,
  ) async {
    expeditionLogService = ExpeditionLogService(expeditionId);

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
        extras: {
          'type': GeofenceTypes.waypoint,
          'waypointId': wp.id,
        },
      );
    }).toList();

    if (geofences.isNotEmpty) {
      await bg.BackgroundGeolocation.addGeofences(geofences);
      getIt<ConsoleService>().addMessage(
          ConsoleMessage(text: '${waypoints.length} waypoints added'));
    }

    var center = await bg.BackgroundGeolocation.getCurrentPosition();
    expeditionLogService.begin(PointCoordinates(
      latitude: center.coords.latitude,
      longitude: center.coords.longitude,
      altitude: center.coords.altitude,
    ));

    _createTechnicalWaypoints(center);

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

  Future<void> close() async {
    getIt<ConsoleService>().addMessage(ConsoleMessage(
        text: 'BackgroundGeolocation stopped, Geofences cleared'));
    await bg.BackgroundGeolocation.stop();
    await bg.BackgroundGeolocation.destroyLocations();
    await bg.BackgroundGeolocation.removeGeofences();
    await bg.BackgroundGeolocation.removeListeners();
  }

  Future<bool> finish() async {
    var center = await bg.BackgroundGeolocation.getCurrentPosition();
    return await expeditionLogService.finish(PointCoordinates(
      latitude: center.coords.latitude,
      longitude: center.coords.longitude,
      altitude: center.coords.altitude,
    ));
  }
}
