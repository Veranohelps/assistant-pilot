import 'package:json_annotation/json_annotation.dart';

part 'geo_json.g.dart';

@JsonSerializable(createFactory: false, createToJson: false)
abstract class Geometry {
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
    GeometryTypes.values.firstWhere(
        (element) => element.toString().toLowerCase() == string.toLowerCase());

@JsonSerializable()
class LineStringGeometry extends Geometry {
  LineStringGeometry({required this.coordinates});

  @override
  GeometryTypes type = GeometryTypes.lineString;

  List<PointCoordinates> coordinates;

  static LineStringGeometry fromJson(Map<String, dynamic> json) =>
      _$LineStringGeometryFromJson(json);

  Map<String, dynamic> toJson() => _$LineStringGeometryToJson(this);
}

@JsonSerializable()
class PointGeometry extends Geometry {
  PointGeometry({required this.coordinates});

  @override
  GeometryTypes type = GeometryTypes.point;

  PointCoordinates coordinates;

  static PointGeometry fromJson(Map<String, dynamic> json) =>
      _$PointGeometryFromJson(json);

  Map<String, dynamic> toJson() => _$PointGeometryToJson(this);
}

class PointCoordinates {
  PointCoordinates({
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

  List<double> toJson() => [longitude, latitude, altitude];
}
