// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'geo_json.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LineStringGeometry _$LineStringGeometryFromJson(Map<String, dynamic> json) {
  return LineStringGeometry(
    coordinates: (json['coordinates'] as List<dynamic>)
        .map((e) => PointCoordinates.fromJson(e as List<dynamic>))
        .toList(),
  )..type = _$enumDecode(_$GeometryTypesEnumMap, json['type']);
}

Map<String, dynamic> _$LineStringGeometryToJson(LineStringGeometry instance) =>
    <String, dynamic>{
      'type': _$GeometryTypesEnumMap[instance.type],
      'coordinates': instance.coordinates,
    };

K _$enumDecode<K, V>(
  Map<K, V> enumValues,
  Object? source, {
  K? unknownValue,
}) {
  if (source == null) {
    throw ArgumentError(
      'A value must be provided. Supported values: '
      '${enumValues.values.join(', ')}',
    );
  }

  return enumValues.entries.singleWhere(
    (e) => e.value == source,
    orElse: () {
      if (unknownValue == null) {
        throw ArgumentError(
          '`$source` is not one of the supported values: '
          '${enumValues.values.join(', ')}',
        );
      }
      return MapEntry(unknownValue, enumValues.values.first);
    },
  ).key;
}

const _$GeometryTypesEnumMap = {
  GeometryTypes.lineString: 'LineString',
  GeometryTypes.point: 'Point',
};

PointGeometry _$PointGeometryFromJson(Map<String, dynamic> json) {
  return PointGeometry(
    coordinates:
        PointCoordinates.fromJson(json['coordinates'] as List<dynamic>),
  )..type = _$enumDecode(_$GeometryTypesEnumMap, json['type']);
}

Map<String, dynamic> _$PointGeometryToJson(PointGeometry instance) =>
    <String, dynamic>{
      'type': _$GeometryTypesEnumMap[instance.type],
      'coordinates': instance.coordinates,
    };
