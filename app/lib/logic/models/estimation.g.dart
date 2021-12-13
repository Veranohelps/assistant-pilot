// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'estimation.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Estimation _$EstimationFromJson(Map<String, dynamic> json) => Estimation(
      activityTypeId: json['activityTypeId'] as String,
      duration: Serialization.fromMinutesToDuration(
          json['estimatedDurationInMinutes'] as num),
      points: (json['estimatedDurationToMeteoPointsOfInterestsInMinutes']
              as List<dynamic>)
          .map((e) =>
              PointOfInterestEstimation.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$EstimationToJson(Estimation instance) =>
    <String, dynamic>{
      'activityTypeId': instance.activityTypeId,
      'estimatedDurationInMinutes': instance.duration.inMicroseconds,
      'estimatedDurationToMeteoPointsOfInterestsInMinutes': instance.points,
    };

PointOfInterestEstimation _$PointOfInterestEstimationFromJson(
        Map<String, dynamic> json) =>
    PointOfInterestEstimation(
      duration:
          Serialization.fromMinutesToDuration(json['estimatedTime'] as num),
      coordinate:
          PointCoordinates.fromJson(json['coordinate'] as List<dynamic>),
    );

Map<String, dynamic> _$PointOfInterestEstimationToJson(
        PointOfInterestEstimation instance) =>
    <String, dynamic>{
      'estimatedTime': instance.duration.inMicroseconds,
      'coordinate': instance.coordinate,
    };
