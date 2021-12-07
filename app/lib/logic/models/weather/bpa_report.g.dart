// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'bpa_report.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

BpaReport _$BpaReportFromJson(Map<String, dynamic> json) => BpaReport(
      url: json['resourceUrl'] as String,
      zones: (json['zones'] as List<dynamic>)
          .map((e) => BpaZone.fromJson(e as Map<String, dynamic>))
          .toList(),
      provider: BpaProvider.fromJson(json['provider'] as Map<String, dynamic>),
      publishDateTime: TimeWithTimeZone.parse(json['publishDate'] as String),
      validUntilDateTime:
          TimeWithTimeZone.parse(json['validUntilDate'] as String),
    );

BpaProvider _$BpaProviderFromJson(Map<String, dynamic> json) => BpaProvider(
      name: json['name'] as String,
      url: json['url'] as String,
    );

BpaZone _$BpaZoneFromJson(Map<String, dynamic> json) => BpaZone(
      name: json['name'] as String,
    );
