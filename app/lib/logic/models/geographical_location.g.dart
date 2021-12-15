// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'geographical_location.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographicalLocation _$GeographicalLocationFromJson(
        Map<String, dynamic> json) =>
    GeographicalLocation(
      fullName: json['fullName'] as String,
      routes: (json['routes'] as List<dynamic>)
          .map((e) => DersuRouteShort.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
