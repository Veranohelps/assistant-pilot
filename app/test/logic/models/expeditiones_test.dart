import 'dart:convert';

import 'package:app/logic/model/expedition.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  final Map<String, dynamic> json = {
    "id": "Ru3zWqcGaBb9EVLKxXcmvo",
    "name": "golondrinas facil",
    "description": "some description",
    "coordinate": {
      "type": "Point",
      "coordinates": [-0.92288, 42.86245, 789.781694]
    },
    "startDateTime": "2022-01-01T00:00:00.000Z",
    "endDateTime": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2021-09-09T13:54:50.909Z",
    "routes": [
      {
        "id": "ooqgmk3jCp1VNZVgzhnQUr",
        "url":
            "https://develop-api.dersu.uz/personal/route/ooqgmk3jCp1VNZVgzhnQUr"
      }
    ],
    "waypoints": [
      {
        "id": "lH8ZwDwYcAwlvN2BnO2rEb",
        "type": "waypoint",
        "name": "Aparcamiento",
        "description": "Aparcamiento",
        "radiusInMeters": 100,
        "coordinate": {
          "type": "Point",
          "coordinates": [-0.52461, 42.719627, 1069]
        },
        "updatedAt": "2021-09-09T13:54:50.909Z"
      },
    ]
  };
  group('Expedition', () {
    test('from json', () {
      var expedition = Expedition.fromJson(json);

      expect(expedition.id, json['id']);
      expect(expedition.name, json['name']);
      expect(expedition.description, json['description']);
      expect(
          expedition.startDateTime, DateTime.parse('2022-01-01T00:00:00.000Z'));
      expect(
          expedition.endDateTime, DateTime.parse('2023-01-01T00:00:00.000Z'));
      expect(expedition.updatedAt, DateTime.parse('2021-09-09T13:54:50.909Z'));

      expect(expedition.waypoints[0].id, (json['waypoints']! as List)[0]['id']);
      expect(expedition.routes[0].id, (json['routes']! as List)[0]['id']);
      expect(expedition.coordinate.longitude,
          json['coordinate']['coordinates'][0]);
      expect(
          expedition.coordinate.latitude, json['coordinate']['coordinates'][1]);
      expect(
          expedition.coordinate.altitude, json['coordinate']['coordinates'][2]);
    });

    test('toJson ', () {
      var expedition = Expedition.fromJson(json);

      expect(jsonEncode(expedition), jsonEncode(json));
    });
  });
}
