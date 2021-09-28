import 'package:equatable/equatable.dart';
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
  point
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

  final PointCoordinates coordinates;

  num get longitude => coordinates.longitude;
  num get latitude => coordinates.latitude;
  num get altitude => coordinates.altitude;

  static PointGeometry fromJson(Map<String, dynamic> json) =>
      _$PointGeometryFromJson(json);

  Map<String, dynamic> toJson() =>
      {'type': 'Point'}..addAll(_$PointGeometryToJson(this));

  @override
  List<Object?> get props => coordinates.props;
}

class PointCoordinates extends Equatable {
  PointCoordinates({
    required this.latitude,
    required this.longitude,
    required this.altitude,
  });

  final num longitude;
  final num latitude;
  final num altitude;

  factory PointCoordinates.fromJson(List list) => PointCoordinates(
        longitude: list[0] as num,
        latitude: list[1] as num,
        altitude: list[2] as num,
      );

  List<num> toJson() => [longitude, latitude, altitude];

  @override
  List<Object?> get props => [longitude, latitude, altitude];
}
