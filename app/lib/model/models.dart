class Expedition {
  final String name;
  final double latitude;
  final double longitude;
  final List<RoutePreInfo> routes;
  final List<WayPoint> waypoints;

  Expedition(
      {required this.name,
      required this.latitude,
      required this.longitude,
      required this.routes,
      required this.waypoints});

  factory Expedition.fromJson(Map<String, dynamic> json) {
    return Expedition(
        name: json['name'],
        latitude: json['location']['latitude'].toDouble(),
        longitude: json['location']['longitude'].toDouble(),
        routes: json['routes']
            .map<RoutePreInfo>((routeJson) => RoutePreInfo.fromJson(routeJson))
            .toList(),
        waypoints: json['waypoints']
            .map<WayPoint>((waypoint) => WayPoint(
                id: waypoint['id'],
                name: waypoint['name'],
                description: waypoint['description'],
                point: RoutePoint.fromJson(waypoint),
                type: waypoint['type'],
                radiusInMeters: waypoint['radius_in_meters'].toDouble()))
            .toList());
  }

  @override
  String toString() {
    return "Expedition, name $name";
  }
}

class RoutePreInfo {
  final String id;
  final String url;

  RoutePreInfo({required this.id, required this.url});

  factory RoutePreInfo.fromJson(Map<String, dynamic> json) {
    return RoutePreInfo(id: json['id'], url: json['url']);
  }

  @override
  String toString() {
    return "RoutePreInfo, id: $id, url: $url";
  }
}

class DersuRoute {
  final String name;
  final List<RoutePoint> points;
  DersuRoute({required this.name, required this.points});

  factory DersuRoute.fromJson(json) {
    final List<dynamic> jsonCoordinates = json['coordinates'] as List<dynamic>;
    final List<RoutePoint> parsedPoints = jsonCoordinates
        .map<RoutePoint>(
            (jsonCoordinate) => RoutePoint.fromJson(jsonCoordinate))
        .toList();
    return DersuRoute(name: json['name'], points: parsedPoints);
  }

  @override
  String toString() {
    return "DersuRoute, name: $name";
  }
}

class WayPoint {
  final String id;
  final RoutePoint point;
  final String type;
  final double radiusInMeters;
  final String name;
  final String description;

  WayPoint(
      {required this.id,
      required this.name,
      required this.description,
      required this.point,
      required this.type,
      required this.radiusInMeters});

  @override
  String toString() {
    return "Waypoint (type: $type)";
  }
}

class RoutePoint {
  final double latitude;
  final double longitude;
  final double altitude;

  RoutePoint(
      {required this.latitude,
      required this.longitude,
      required this.altitude});

  factory RoutePoint.fromJson(json) {
    return RoutePoint(
        latitude: json['latitude'].toDouble(),
        longitude: json['longitude'].toDouble(),
        altitude: json['altitude'].toDouble());
  }
}
