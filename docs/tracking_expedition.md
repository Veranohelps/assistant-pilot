## User location tracking.
by creating technical geozones;

1. After expeditions start the app creates 5 technical geofence zones in a distance of 4 km between the phone location and the centre of the geozone. Geozones radius is 2.8 km.
2. When user enters in a technical geozone, the app logs a current phone location, remove old technical geozones and create new ones.
3. The app removes all geozones when user finishes expedition.

## User activity tracking during expedition.

The app tracks:
- Start of the expedition
- Entering in a dersu waypoint geozone;
- Entering in technical geozone; (user location tracking);
- Finish of the expedition.

Sending events to the backend sever:

- The app sends the start event on expedition starts; (all errors will be ignoring)
- The app sends the list of all events including start event on expedition finish. (on any error, a special pop-up window with will be shown)
- Thee app stores all events to the local storage; If the app would be closed during expedition, it restores activity in the next live expedition session; 