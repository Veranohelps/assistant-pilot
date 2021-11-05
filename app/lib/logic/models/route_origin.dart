import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

part 'route_origin.g.dart';

@JsonSerializable(createToJson: false)
class RouteOrigin extends Equatable {
  final String id;
  final String name;
  final String description;

  const RouteOrigin({
    required this.id,
    required this.name,
    required this.description,
  });

  @override
  List<Object?> get props => [id, name, description];

  factory RouteOrigin.fromJson(Map<String, dynamic> json) =>
      _$RouteOriginFromJson(json);
}
