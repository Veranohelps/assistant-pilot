// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'geo_json.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LineStringGeometry _$LineStringGeometryFromJson(Map<String, dynamic> json) =>
    LineStringGeometry(
      coordinates: (json['coordinates'] as List<dynamic>)
          .map((e) => PointCoordinates.fromJson(e as List<dynamic>))
          .toList(),
    );

Map<String, dynamic> _$LineStringGeometryToJson(LineStringGeometry instance) =>
    <String, dynamic>{
      'coordinates': instance.coordinates,
    };

PointGeometry _$PointGeometryFromJson(Map<String, dynamic> json) =>
    PointGeometry(
      coordinates:
          PointCoordinates.fromJson(json['coordinates'] as List<dynamic>),
    );

Map<String, dynamic> _$PointGeometryToJson(PointGeometry instance) =>
    <String, dynamic>{
      'coordinates': instance.coordinates,
    };

MultyPointGeometry _$MultyPointGeometryFromJson(Map<String, dynamic> json) =>
    MultyPointGeometry(
      coordinates: (json['coordinates'] as List<dynamic>)
          .map((e) => PointCoordinates.fromJson(e as List<dynamic>))
          .toList(),
    );

Map<String, dynamic> _$MultyPointGeometryToJson(MultyPointGeometry instance) =>
    <String, dynamic>{
      'coordinates': instance.coordinates,
    };
