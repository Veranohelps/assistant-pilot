import 'package:flutter/material.dart';

class WaypointTappedDialog extends AlertDialog {
  WaypointTappedDialog({required waypoint, required dismissHandler})
      : super(
          key: Key("waypointDialog"),
          title: new Text("🚨 Cuidado 🚨"),
          content: new Text("Waypoint tipo: " + waypoint.type),
          actions: <Widget>[
            TextButton(
              child: Text("OK"),
              // NOTE (JD): it's just executing the handler, not calling it!
              onPressed: dismissHandler,
            )
          ],
        );
}
