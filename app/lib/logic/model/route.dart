import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

import 'package:app/logic/model/geo_json.dart';

part 'route.g.dart';

abstract class DersuRoute extends Equatable {
  final String name;
  final String originId;
  final String? userId;
  final String id;
  final DateTime updatedAt;

  DersuRoute({
    required this.id,
    required this.name,
    required this.originId,
    required this.userId,
    required this.updatedAt,
  });

  @override
  String toString() {
    return "DersuRoute, name: $name";
  }

  @override
  List<Object?> get props => [name, originId, userId, id];
}

@JsonSerializable()
class DersuRouteFull extends DersuRoute {
  final LineStringGeometry coordinate;

  DersuRouteFull({
    required String id,
    required String name,
    required String originId,
    required DateTime updatedAt,
    required this.coordinate,
    String? userId,
  }) : super(
          id: id,
          name: name,
          originId: originId,
          userId: userId,
          updatedAt: updatedAt,
        );

  List<PointCoordinates> get coordinates => coordinate.coordinates;

  @override
  List<Object?> get props => [name, originId, userId, coordinate, id];

  factory DersuRouteFull.fromJson(Map<String, dynamic> json) =>
      _$DersuRouteFullFromJson(json);

  Map<String, dynamic> toJson() => _$DersuRouteFullToJson(this);
}

@JsonSerializable(createToJson: false)
class DersuRouteShort extends DersuRoute {
  final String url;

  DersuRouteShort({
    required String id,
    required String name,
    required String originId,
    required DateTime updatedAt,
    required this.url,
    String? userId,
  }) : super(
          id: id,
          name: name,
          originId: originId,
          userId: userId,
          updatedAt: updatedAt,
        );

  @override
  List<Object?> get props => [name, originId, userId, url, id];

  factory DersuRouteShort.fromJson(Map<String, dynamic> json) =>
      _$DersuRouteShortFromJson(json);
}
