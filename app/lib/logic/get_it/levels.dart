import 'package:app/logic/api_maps/dictionaries.dart';
import 'package:app/logic/model/levels.dart';
import 'package:flutter/material.dart';

class LevelsService extends ChangeNotifier {
  bool isLoaded = false;
  final api = DictionariesApi();
  late List<Category> categories;

  Future<void> load() async {
    categories = await api.fetchLevelCategories();
    isLoaded = true;
    notifyListeners();
  }

  List<LevelsCatalogData> flat() {
    var res = <LevelsCatalogData>[];

    for (final categorie in categories) {
      res.add(categorie);
      res.addAll(categorie.children);
    }

    return res;
  }
}
