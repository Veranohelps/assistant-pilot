import 'package:app/logic/models/time_with_timezone.dart';
import 'package:json_annotation/json_annotation.dart';

part 'bpa_report.g.dart';

@JsonSerializable(createToJson: false)
class BpaReport {
  @JsonKey(name: 'resourceUrl')
  final String url;
  final BpaProvider provider;
  final List<BpaZone> zones;

  @JsonKey(name: 'publishDate', fromJson: TimeWithTimeZone.parse)
  final TimeWithTimeZone publishDateTime;

  @JsonKey(name: 'validUntilDate', fromJson: TimeWithTimeZone.parse)
  final TimeWithTimeZone validUntilDateTime;

  BpaReport(
      {required this.url,
      required this.zones,
      required this.provider,
      required this.publishDateTime,
      required this.validUntilDateTime});

  static BpaReport fromJson(Map<String, dynamic> json) =>
      _$BpaReportFromJson(json);
}

@JsonSerializable(createToJson: false)
class BpaProvider {
  final String name;
  final String url;

  BpaProvider({required this.name, required this.url});

  static BpaProvider fromJson(Map<String, dynamic> json) =>
      _$BpaProviderFromJson(json);
}

@JsonSerializable(createToJson: false)
class BpaZone {
  final String name;

  BpaZone({required this.name});

  static BpaZone fromJson(Map<String, dynamic> json) => _$BpaZoneFromJson(json);
}
