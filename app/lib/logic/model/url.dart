import 'package:json_annotation/json_annotation.dart';

part 'url.g.dart';

@JsonSerializable()
class DersuUrlModel {
  DersuUrlModel({
    required this.id,
    required this.url,
  });

  final String id;
  final String url;

  factory DersuUrlModel.fromJson(Map<String, dynamic> json) =>
      _$DersuUrlModelFromJson(json);

  Map<String, dynamic> toJson() => _$DersuUrlModelToJson(this);
}
