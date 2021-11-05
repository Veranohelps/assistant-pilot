import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';
part 'activity_type.g.dart';

@JsonSerializable(createToJson: false)
class ActivityType extends Equatable {
  const ActivityType({
    required this.id,
    required this.name,
    required this.description,
  });

  final String id;
  final String name;
  final String? description;

  @override
  List<Object?> get props => [id, name, description];

  factory ActivityType.fromJson(Map<String, dynamic> json) =>
      _$ActivityTypeFromJson(json);
}
