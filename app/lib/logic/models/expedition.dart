import 'package:app/logic/models/profile.dart';
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
  final List<String> activityTypeIds;

  const Expedition({
    required this.id,
    required this.userId,
    required this.name,
    required this.coordinate,
    required this.startDateTime,
    required this.updatedAt,
    required this.activityTypeIds,
    this.description,
  });
}

@JsonSerializable(createToJson: false)
class ExpeditionShort extends Expedition {
  final String url;

  const ExpeditionShort({
    required String id,
    required String name,
    required PointGeometry coordinate,
    required DateTime startDateTime,
    required DateTime updatedAt,
    required List<String> activityTypeIds,
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
          description: description,
          activityTypeIds: activityTypeIds,
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
  static ExpeditionShort fromJson(Map<String, dynamic> json) =>
      _$ExpeditionShortFromJson(json);
}

@JsonSerializable()
class ExpeditionFull extends Expedition {
  final List<DersuRouteFull> routes;
  final List<GroupUser> users;

  const ExpeditionFull({
    required String id,
    required String name,
    required PointGeometry coordinate,
    required DateTime startDateTime,
    required DateTime updatedAt,
    required List<String> activityTypeIds,
    String? userId,
    String? description,
    required this.routes,
    required this.users,
  }) : super(
          id: id,
          userId: userId,
          name: name,
          coordinate: coordinate,
          startDateTime: startDateTime,
          updatedAt: updatedAt,
          activityTypeIds: activityTypeIds,
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

  static ExpeditionFull fromJson(Map<String, dynamic> json) =>
      _$ExpeditionFullFromJson(json);

  Map<String, dynamic> toJson() => _$ExpeditionFullToJson(this);
}
