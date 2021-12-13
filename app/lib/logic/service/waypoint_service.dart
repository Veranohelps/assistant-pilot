import 'dart:convert';
import 'package:flutter/services.dart' show rootBundle;

class WaypointService {
  static Future<String> getNotificationByTypeId(String id) async {
    String notifications = await rootBundle
        .loadString('assets/content/waypoint_notifications.json');

    final json = jsonDecode(notifications);

    var notification = '';

    json.forEach((entry) {
      var ids = entry['ids'] as String;
      if (ids.contains(id)) {
        notification = entry['notification'] as String;
      }
    });

    return notification;
  }
}
