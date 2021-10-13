import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

import 'package:app/logic/models/route.dart';

import 'geo_json.dart';

part 'expedition.g.dart';

abstract class Expedition extends Equatable {
  final String id;
  final String? userId;
  final String name;
  final String? description;
  final PointGeometry coordinate;
  final DateTime startDateTime;
  final DateTime updatedAt;

  Expedition({
    required this.id,
    required this.userId,
    required this.name,
    required this.coordinate,
    required this.startDateTime,
    required this.updatedAt,
    this.description,
  });
}

@JsonSerializable(createToJson: false)
class ExpeditionShort extends Expedition {
  final String url;

  ExpeditionShort({
    required String id,
    required String name,
    required PointGeometry coordinate,
    required DateTime startDateTime,
    required DateTime updatedAt,
    String? userId,
    String? description,
    required this.url,
  }) : super(
          id: id,
          userId: userId,
          name: name,
          coordinate: coordinate,
          startDateTime: startDateTime,
          updatedAt: updatedAt,
        );

  @override
  List<Object?> get props => [
        id,
        userId,
        name,
        description,
        coordinate,
        startDateTime,
        updatedAt,
        url
      ];
  static ExpeditionShort fromJson(Map<String, dynamic> json) => _$ExpeditionShortFromJson(json);
}

@JsonSerializable(createToJson: false)
class ExpeditionFull extends Expedition {
  final List<DersuRouteFull> routes;

  ExpeditionFull({
    required String id,
    required String name,
    required PointGeometry coordinate,
    required DateTime startDateTime,
    required DateTime updatedAt,
    String? userId,
    String? description,
    required this.routes,
  }) : super(
          id: id,
          userId: userId,
          name: name,
          coordinate: coordinate,
          startDateTime: startDateTime,
          updatedAt: updatedAt,
        );

  @override
  List<Object?> get props => [
        id,
        userId,
        name,
        description,
        coordinate,
        startDateTime,
        updatedAt,
        routes,
      ];

  static fromJson(Map<String, dynamic> json) => _$ExpeditionFullFromJson(json);
}
