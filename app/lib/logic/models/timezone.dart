import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

part 'timezone.g.dart';

@JsonSerializable()
class Timezone extends Equatable {
  final int dstOffset;
  final int rawOffset;
  final String timeZoneId;
  final String timeZoneName;

  const Timezone({
    required this.dstOffset,
    required this.rawOffset,
    required this.timeZoneId,
    required this.timeZoneName,
  });

  @override
  List<Object?> get props => [
        dstOffset,
        rawOffset,
        timeZoneId,
        timeZoneName,
      ];

  Duration get offset => Duration(seconds: rawOffset);

  factory Timezone.fromJson(Map<String, dynamic> json) =>
      _$TimezoneFromJson(json);

  Map<String, dynamic> toJson() => _$TimezoneToJson(this);
}
