// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'activity_type.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ActivityType _$ActivityTypeFromJson(Map<String, dynamic> json) => ActivityType(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      skillId: json['skillId'] as String,
      defaultPace: (json['defaultPace'] as num).toDouble(),
      uphillPace: (json['uphillPace'] as num).toDouble(),
      downhillPace: (json['downhillPace'] as num).toDouble(),
      unknownPercentage: (json['unknownPercentage'] as num).toDouble(),
    );
