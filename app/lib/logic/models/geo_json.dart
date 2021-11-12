import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'package:json_annotation/json_annotation.dart';

part 'geo_json.g.dart';

@JsonSerializable(createFactory: false, createToJson: false)
abstract class Geometry extends Equatable {
  GeometryTypes get type;
  dynamic get coordinates;

  static Geometry fromJson(Map<String, dynamic> json) {
    var type = geometryTypesFromString(json['type']);
    if (type == GeometryTypes.lineString) {
      return LineStringGeometry.fromJson(json);
    } else if (type == GeometryTypes.point) {
      return PointGeometry.fromJson(json);
    }
    throw 'wrong type';
  }
}

enum GeometryTypes {
  @JsonValue('LineString')
  lineString,

  @JsonValue('Point')
  point,

  @JsonValue('MulitPoint')
  mulitPoint
}

GeometryTypes geometryTypesFromString(String string) =>
    GeometryTypes.values.firstWhere((element) {
      return element.toString().split('.')[1].toLowerCase() ==
          string.toLowerCase();
    });

@JsonSerializable()
class LineStringGeometry extends Geometry {
  LineStringGeometry({required this.coordinates});

  @override
  @JsonKey(ignore: true)
  final GeometryTypes type = GeometryTypes.lineString;

  @override
  final List<PointCoordinates> coordinates;

  static LineStringGeometry fromJson(Map<String, dynamic> json) =>
      _$LineStringGeometryFromJson(json);

  Map<String, dynamic> toJson() =>
      {'type': 'LineString'}..addAll(_$LineStringGeometryToJson(this));

  @override
  List<Object?> get props => coordinates;
}

@JsonSerializable()
class PointGeometry extends Geometry {
  PointGeometry({required this.coordinates});

  @override
  @JsonKey(ignore: true)
  final GeometryTypes type = GeometryTypes.point;

  @override
  final PointCoordinates coordinates;

  double get longitude => coordinates.longitude;
  double get latitude => coordinates.latitude;
  double get altitude => coordinates.altitude;

  static PointGeometry fromJson(Map<String, dynamic> json) =>
      _$PointGeometryFromJson(json);

  Map<String, dynamic> toJson() =>
      {'type': 'Point'}..addAll(_$PointGeometryToJson(this));

  @override
  List<Object?> get props => coordinates.props;
}

@JsonSerializable()
class MultyPointGeometry extends Geometry {
  MultyPointGeometry({required this.coordinates});

  @override
  @JsonKey(ignore: true)
  final GeometryTypes type = GeometryTypes.mulitPoint;

  @override
  final List<PointCoordinates> coordinates;

  static MultyPointGeometry fromJson(Map<String, dynamic> json) =>
      _$MultyPointGeometryFromJson(json);

  Map<String, dynamic> toJson() =>
      {'type': 'MulitPoint'}..addAll(_$MultyPointGeometryToJson(this));

  @override
  List<Object?> get props => coordinates;
}

@immutable
class PointCoordinates extends Equatable {
  const PointCoordinates({
    required this.latitude,
    required this.longitude,
    required this.altitude,
  });

  final double longitude;
  final double latitude;
  final double altitude;

  factory PointCoordinates.fromJson(List list) => PointCoordinates(
        longitude: (list[0] as num).toDouble(),
        latitude: (list[1] as num).toDouble(),
        altitude: (list[2] as num).toDouble(),
      );

  List<num> toJson() => [longitude, latitude, altitude];

  @override
  List<Object?> get props => [longitude, latitude, altitude];
}
