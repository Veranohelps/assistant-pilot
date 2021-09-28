import 'dart:convert';

import 'package:app/config/hive_config.dart';
import 'package:app/logic/api_maps/dersu_api.dart';
import 'package:hive_flutter/hive_flutter.dart';

const mockKey = 'LevelsApiKey';

class LevelsApi extends PrivateDersuApi {
  var tempBox = Hive.box(HiveContants.tempMock.txt);

  Future<Map<String, String>> fetch() async {
    var res = Map<String, String>.from(
        jsonDecode(await tempBox.get(mockKey, defaultValue: '{}')));
    return res;
  }

  Future<void> update(Map<String, String> levelMap) async {
    await tempBox.put(
      mockKey,
      jsonEncode(levelMap),
    );
  }
}
