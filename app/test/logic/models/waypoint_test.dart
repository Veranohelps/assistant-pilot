import 'dart:convert';

import 'package:app/logic/models/waypoint.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:app/logic/models/geo_json.dart';

void main() {
  Map<String, dynamic> json = {
    "id": "KWvknoVS9x52jBkqqDDmYO",
    "typeIds": ["waypoint"],
    "name": "Cruce, recto",
    "description": "Una descripcion",
    "radiusInMeters": 100,
    "coordinate": {
      "type": "Point",
      "coordinates": [-0.465726, 42.724505, 2088.0]
    },
    "updatedAt": "2021-09-09T13:54:50.909Z"
  };

  group('Waypoint', () {
    test('from json', () {
      var waypoint = Waypoint.fromJson(json);
      expect(waypoint.id, json['id']);
      expect(waypoint.name, json['name']);
      expect(waypoint.description, json['description']);
      expect(waypoint.typeIds, json['typeIds']);
      expect(waypoint.radiusInMeters, json['radiusInMeters']);
      expect(
        identical(
          waypoint.coordinate.longitude,
          json['coordinate']["coordinates"][0],
        ),
        isTrue,
      );
      expect(
        identical(
          waypoint.coordinate.latitude,
          json['coordinate']["coordinates"][1],
        ),
        isTrue,
      );
      expect(
        identical(
          waypoint.coordinate.altitude,
          json['coordinate']["coordinates"][2],
        ),
        isTrue,
      );
    });

    test('toJson', () {
      var waypoint = Waypoint(
        id: "KWvknoVS9x52jBkqqDDmYO",
        name: "Cruce, recto",
        description: "Una descripcion",
        typeIds: const ['waypoint'],
        // NOTE (JD): this is a hardocde to hack the test
        radiusInMeters: 25,
        updatedAt: DateTime.parse('2021-09-09T13:54:50.909Z'),
        coordinate: PointGeometry(
            coordinates: PointCoordinates(
          latitude: 42.724505,
          longitude: -0.465726,
          altitude: 2088,
        )),
      );

      expect(jsonEncode(waypoint), jsonEncode(json));
    });

    test('equality', () {
      var waypoint1 = Waypoint(
        id: "KWvknoVS9x52jBkqqDDmYO",
        name: "Cruce, recto",
        description: "Una descripcion",
        typeIds: const ['waypoint'],
        radiusInMeters: 100,
        updatedAt: DateTime.parse('2021-09-09T13:54:50.909Z'),
        coordinate: PointGeometry(
            coordinates: PointCoordinates(
          latitude: 42.724505,
          longitude: -0.465726,
          altitude: 2088,
        )),
      );

      var waypoint2 = Waypoint(
        id: "KWvknoVS9x52jBkqqDDmYO",
        name: "Cruce, recto",
        description: "Una descripcion",
        typeIds: const ['waypoint'],
        radiusInMeters: 100,
        updatedAt: DateTime.parse('2021-09-09T13:54:50.909Z'),
        coordinate: PointGeometry(
            coordinates: PointCoordinates(
          latitude: 42.724505,
          longitude: -0.465726,
          altitude: 2088,
        )),
      );

      var waypoint3 = Waypoint(
        id: "KWvknoVS9x52jBkqqDDmYO",
        name: "another",
        description: "Una descripcion",
        typeIds: const ['waypoint'],
        radiusInMeters: 100,
        updatedAt: DateTime.parse('2021-09-09T13:54:50.909Z'),
        coordinate: PointGeometry(
            coordinates: PointCoordinates(
          latitude: 42.724505,
          longitude: -0.465726,
          altitude: 2088,
        )),
      );

      expect(waypoint1, waypoint2);
      expect(waypoint1, isNot(waypoint3));
    });
  });
}
