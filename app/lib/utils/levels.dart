import 'package:app/logic/cubits/dictionaries/dictionaries_cubit.dart';
import 'package:app/logic/models/levels.dart';

int? compareUserLevesWithNeededLevel(
  DictionariesLoaded dict,
  List<LevelsCatalogData> checkingLevelTree,
  Map<String, String> profileLevel,
) {
  // null: - user didn't set this skill
  // 0 - the users level is the same as checking level
  // bellow zero : the user level is below the checking level
  // above zero : the user level is above the checking level


  var userLevelId = profileLevel[checkingLevelTree[1].id];
  if (userLevelId == null) {
    return null;
  }

  var userLevelTree = dict.levelTreeByLevelId(userLevelId);

  var checkingLevel = (checkingLevelTree[2] as Level).level;
  var userLevel = (userLevelTree[2] as Level).level;

  return userLevel - checkingLevel;
}
