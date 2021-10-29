import 'package:app/logic/models/serialization.dart';
import 'package:json_annotation/json_annotation.dart';

part 'meteogram.g.dart';

@JsonSerializable(createToJson: false)
class Meteogram {
  @JsonKey(fromJson: Serialization.rangeFromString)
  final List<int> range;

  @JsonKey(name: 'meteogram')
  final String url;

  Meteogram(this.range, this.url);

  static Meteogram fromJson(Map<String, dynamic> json) =>
      _$MeteogramFromJson(json);
}
