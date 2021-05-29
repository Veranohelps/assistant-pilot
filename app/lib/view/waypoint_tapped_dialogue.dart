import 'package:flutter/material.dart';

class WaypointTappedDialogue extends AlertDialog {
  WaypointTappedDialogue({required waypoint, required dismissHandler})
      : super(
          key: Key("waypointDialogue"),
          title: new Text(waypoint.name),
          content: new Text(waypoint.description),
          actions: <Widget>[
            TextButton(
              child: Text("OK"),
              // NOTE (JD): it's just executing the handler, not calling it!
              onPressed: dismissHandler,
            )
          ],
        );
}
