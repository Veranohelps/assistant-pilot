import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:app/logic/models/geo_json.dart';

void main() {
  const longitude = 1.0;
  const latitude = 2.0;
  const altitude = 3.0;
  final pointData = [longitude, latitude, altitude];
  var point = PointCoordinates(
    longitude: longitude,
    latitude: latitude,
    altitude: altitude,
  );
  var diffentPoint = PointCoordinates(
    longitude: longitude,
    latitude: latitude,
    altitude: 4.0,
  );
  group('PointCoordinates', () {
    test('fromJson ', () {
      var point = PointCoordinates.fromJson(pointData);
      expect(point.longitude, longitude);
      expect(point.latitude, latitude);
      expect(point.altitude, altitude);
    });

    test('toJson ', () {
      var json = point.toJson();
      expect(json[0], longitude);
      expect(json[1], latitude);
      expect(json[2], altitude);
    });
    test('equality ', () {
      var point1 = PointCoordinates(
        longitude: longitude,
        latitude: latitude,
        altitude: altitude,
      );
      var point2 = PointCoordinates(
        longitude: longitude,
        latitude: latitude,
        altitude: altitude,
      );
      expect(point1, point2);
      expect(point1, isNot(diffentPoint));
    });
  });

  group('LineStringGeometry', () {
    test('fromJson', () {
      var json = {
        "type": 'LineString',
        "coordinates": [pointData]
      };
      final point = PointCoordinates(
        longitude: longitude,
        latitude: latitude,
        altitude: altitude,
      );

      var lineString = Geometry.fromJson(json);

      expect(lineString is LineStringGeometry, isTrue);
      expect((lineString as LineStringGeometry).coordinates.length, 1);
      expect(lineString.coordinates[0], point);
    });

    test('toJson', () {
      var expectedJson = {
        "coordinates": [pointData],
        "type": 'LineString',
      };

      var lineString = LineStringGeometry(coordinates: [point]);
      var json = jsonEncode(lineString);
      expect(json, jsonEncode(expectedJson));
    });

    test('equality', () {
      var lineString1 = LineStringGeometry(coordinates: [point]);
      var lineString2 = LineStringGeometry(coordinates: [point]);
      var lineString3 = LineStringGeometry(coordinates: [diffentPoint]);

      expect(lineString1, lineString2);
      expect(lineString1, isNot(lineString3));
    });
  });

  group('PointGeometry', () {
    test('fromJson', () {
      var json = {"type": 'Point', "coordinates": pointData};
      final point = PointCoordinates(
        longitude: longitude,
        latitude: latitude,
        altitude: altitude,
      );

      var pointGeometry = Geometry.fromJson(json);

      expect(pointGeometry is PointGeometry, isTrue);
      expect((pointGeometry as PointGeometry).coordinates, point);
    });

    test('equality', () {
      var expectedJson = {
        "coordinates": pointData,
        "type": 'Point',
      };

      var lineString = PointGeometry(coordinates: point);
      var json = jsonEncode(lineString);
      expect(json, jsonEncode(expectedJson));
    });

    test('equality', () {
      final pointGeometry1 = PointGeometry(coordinates: point);
      final pointGeometry2 = PointGeometry(coordinates: point);

      expect(pointGeometry1, pointGeometry2);
    });

    test('equality', () {
      final pointGeometry1 = PointGeometry(coordinates: point);
      final pointGeometry2 = PointGeometry(coordinates: point);
      final pointGeometry3 = PointGeometry(coordinates: diffentPoint);

      expect(pointGeometry1, pointGeometry2);
      expect(pointGeometry1, isNot(pointGeometry3));
    });

    test('short getters', () {
      final pointGeometry = PointGeometry(coordinates: point);

      expect(pointGeometry.longitude, longitude);
      expect(pointGeometry.latitude, latitude);
      expect(pointGeometry.altitude, altitude);
    });
  });
}
