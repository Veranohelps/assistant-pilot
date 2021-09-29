import 'package:app/logic/api_maps/dersu_api.dart';
import 'package:app/logic/model/levels.dart';
import 'package:app/logic/model/url.dart';

final dictionaryUrl = '/dictionary';

class DictionariesApi extends PrivateDersuApi {
  Future<List<Category>> fetchLevelCategories() async {
    var client = await getClient();
    var res = await client.get('$dictionaryUrl/skill');
    client.close();
    return (res.data['data']['dictionaryLevels'] as List)
        .map<Category>((json) => Category.fromJson(json))
        .toList();
  }

  // Todo: use it again when skills add
  // Future<List<Category>> fetchLevelCategories() async {
  //   var allDictionaries = await fetchDictionary();
  //   var levelUrl =
  //       allDictionaries.firstWhere((element) => element.id == 'levels');
  //   var client = await getClient();
  //   var res = await client.get(levelUrl.url);
  //   client.close();
  //   return (res.data['data']['dictionaryLevels'] as List)
  //       .map<Category>((json) => Category.fromJson(json))
  //       .toList();
  // }

  Future<List<DersuUrlModel>> fetchDictionary() async {
    var client = await getClient();
    var res = await client.get(dictionaryUrl);
    client.close();
    return (res.data['data']['dictionaries'] as List)
        .map<DersuUrlModel>((json) => DersuUrlModel.fromJson(json))
        .toList();
  }
}
