import 'package:json_annotation/json_annotation.dart';

part 'waypoint_type.g.dart';

@JsonSerializable(createToJson: false)
class WaypointType {
  final String id;
  final String name;

  WaypointType({required this.id, required this.name});

  factory WaypointType.fromJson(Map<String, dynamic> json) {
    return _$WaypointTypeFromJson(json);
  }
}
