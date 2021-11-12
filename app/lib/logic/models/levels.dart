import 'package:equatable/equatable.dart';
import 'package:json_annotation/json_annotation.dart';

part 'levels.g.dart';

abstract class LevelsCatalogData extends Equatable {
  const LevelsCatalogData();

  abstract final String id;
  abstract final String name;
  abstract final String description;
}

@JsonSerializable()
class Category extends LevelsCatalogData {
  const Category({
    required this.id,
    required this.name,
    required this.description,
    required this.children,
  });

  @override
  final String id;

  @override
  final String name;

  @override
  final String description;

  @JsonKey(name: 'skills')
  final List<Skill> children;

  factory Category.fromJson(Map<String, dynamic> json) =>
      _$CategoryFromJson(json);

  Map<String, dynamic> toJson() => _$CategoryToJson(this);

  @override
  List<Object?> get props => [id, name, description, ...children];
}

@JsonSerializable()
class Skill extends LevelsCatalogData {
  const Skill({
    required this.id,
    required this.name,
    required this.description,
    required this.children,
    required this.categoryId,
  });

  @override
  final String id;

  @override
  final String name;

  @override
  final String description;

  final String categoryId;

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

  @override
  List<Object?> get props => [id, name, description, ...children];
}

@JsonSerializable()
class Level extends LevelsCatalogData {
  const Level({
    required this.id,
    required this.name,
    required this.description,
    required this.level,
    required this.skillId,
  });

  @override
  final String id;

  @override
  final String name;

  @override
  final String description;

  final int level;

  final String skillId;

  factory Level.fromJson(Map<String, dynamic> json) => _$LevelFromJson(json);

  Map<String, dynamic> toJson() => _$LevelToJson(this);

  @override
  List<Object?> get props => [id, name, description, level];
}
