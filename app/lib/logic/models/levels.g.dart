// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'levels.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Category _$CategoryFromJson(Map<String, dynamic> json) {
  return Category(
    id: json['id'] as String,
    name: json['name'] as String,
    description: json['description'] as String,
    children: (json['skills'] as List<dynamic>)
        .map((e) => Skill.fromJson(e as Map<String, dynamic>))
        .toList(),
  );
}

Map<String, dynamic> _$CategoryToJson(Category instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'skills': instance.children,
    };

Skill _$SkillFromJson(Map<String, dynamic> json) {
  return Skill(
    id: json['id'] as String,
    name: json['name'] as String,
    description: json['description'] as String,
    children: (json['levels'] as List<dynamic>)
        .map((e) => Level.fromJson(e as Map<String, dynamic>))
        .toList(),
  );
}

Map<String, dynamic> _$SkillToJson(Skill instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'levels': instance.children,
    };

Level _$LevelFromJson(Map<String, dynamic> json) {
  return Level(
    id: json['id'] as String,
    name: json['name'] as String,
    description: json['description'] as String,
    level: json['level'] as int,
  );
}

Map<String, dynamic> _$LevelToJson(Level instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'level': instance.level,
    };