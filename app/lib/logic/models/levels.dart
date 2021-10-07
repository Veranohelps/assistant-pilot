import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

part 'levels.g.dart';

class LevelsCatalogData<T> extends Equatable {
  LevelsCatalogData({
    required this.id,
    required this.name,
    required this.description,
    required this.children,
  });

  final String id;
  final String name;
  final String description;
  final List<T> children;

  @override
  List<Object?> get props => [id, name, description, ...children];
}

@JsonSerializable()
class Category extends LevelsCatalogData<Skill> {
  Category({
    required String id,
    required String name,
    required String description,
    required this.children,
  }) : super(
          id: id,
          name: name,
          description: description,
          children: children,
        );

  @JsonKey(name: 'skills')
  final List<Skill> children;

  factory Category.fromJson(Map<String, dynamic> json) =>
      _$CategoryFromJson(json);

  static get skills => null;

  Map<String, dynamic> toJson() => _$CategoryToJson(this);
}

@JsonSerializable()
class Skill extends LevelsCatalogData<Level> {
  Skill({
    required String id,
    required String name,
    required String description,
    required this.children,
  }) : super(
          id: id,
          name: name,
          description: description,
          children: children,
        );

  @JsonKey(name: 'levels')
  final List<Level> children;

  Level? levelByLevelId(String? id) {
    if (id == null) {
      return null;
    }

    return children.firstWhere((element) => element.id == id);
  }

  factory Skill.fromJson(Map<String, dynamic> json) => _$SkillFromJson(json);

  Map<String, dynamic> toJson() => _$SkillToJson(this);
}

@JsonSerializable()
class Level extends Equatable {
  Level({
    required this.id,
    required this.name,
    required this.description,
    required this.level,
  });

  final String id;
  final String name;
  final String description;
  final int level;

  factory Level.fromJson(Map<String, dynamic> json) => _$LevelFromJson(json);

  Map<String, dynamic> toJson() => _$LevelToJson(this);

  @override
  List<Object?> get props => [id, name, description, level];
}
