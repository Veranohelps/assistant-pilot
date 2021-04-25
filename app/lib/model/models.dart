class Expedition {
  final String name;
  final double latitude;
  final double longitude;
  final List<RoutePreInfo> routes;

  Expedition(
      {required this.name,
      required this.latitude,
      required this.longitude,
      required this.routes});

  factory Expedition.fromJson(Map<String, dynamic> json) {
    return Expedition(
        name: json['name'],
        latitude: double.parse(json['location']['latitude']),
        longitude: double.parse(json['location']['longitude']),
        routes: json['routes']
            .map<RoutePreInfo>((routeJson) => RoutePreInfo.fromJson(routeJson))
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
        .map<RoutePoint>((jsonCoordinate) => RoutePoint(
            latitude: jsonCoordinate['latitude'].toDouble(),
            longitude: jsonCoordinate['longitude'].toDouble(),
            altitude: jsonCoordinate['altitude'].toDouble()))
        .toList();
    return DersuRoute(name: json['name'], points: parsedPoints);
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
}
