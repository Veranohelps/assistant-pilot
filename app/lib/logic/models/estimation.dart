import 'package:app/logic/models/geo_json.dart';
import 'package:app/logic/models/serialization.dart';
import 'package:json_annotation/json_annotation.dart';

part 'estimation.g.dart';

@JsonSerializable()
class Estimation {
  final String activityTypeId;

  @JsonKey(
      name: 'estimatedDurationInMinutes',
      fromJson: Serialization.fromMinutesToDuration)
  final Duration duration;

  @JsonKey(name: 'estimatedDurationToMeteoPointsOfInterestsInMinutes')
  final List<PointOfInterestEstimation> points;

  Estimation({
    required this.activityTypeId,
    required this.duration,
    required this.points,
  });

  static Estimation fromJson(Map<String, dynamic> json) =>
      _$EstimationFromJson(json);

  Map<String, dynamic> toJson() => _$EstimationToJson(this);
}

@JsonSerializable()
class PointOfInterestEstimation {
  @JsonKey(name: 'estimatedTime', fromJson: Serialization.fromMinutesToDuration)
  final Duration duration;
  final PointCoordinates coordinate;

  PointOfInterestEstimation({
    required this.duration,
    required this.coordinate,
  });

  static PointOfInterestEstimation fromJson(Map<String, dynamic> json) =>
      _$PointOfInterestEstimationFromJson(json);

  Map<String, dynamic> toJson() => _$PointOfInterestEstimationToJson(this);
}
