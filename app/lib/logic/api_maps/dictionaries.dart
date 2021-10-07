import 'package:app/logic/api_maps/dersu_api.dart';
import 'package:app/logic/models/levels.dart';
import 'package:app/logic/models/url.dart';
import 'package:app/logic/models/route_origin.dart';

final dictionaryUrl = '/dictionary';

class DictionariesApi extends PrivateDersuApi {
  Future<List<RouteOrigin>> fetchRouteOrigins() async {
    var allDictionaries = await fetchDictionary();
    var routesUrl =
        allDictionaries.firstWhere((element) => element.id == 'route-origin');

    var client = await getClient();
    var res = await client.get(routesUrl.url);
    client.close();
    return (res.data['data']['routeOrigins'] as List)
        .map<RouteOrigin>((json) => RouteOrigin.fromJson(json))
        .toList();
  }

  Future<List<Category>> fetchLevelCategories() async {
    var allDictionaries = await fetchDictionary();
    var levelUrl =
        allDictionaries.firstWhere((element) => element.id == 'skill');
    var client = await getClient();
    var res = await client.get(levelUrl.url);
    client.close();
    return (res.data['data']['skills'] as List)
        .map<Category>((json) => Category.fromJson(json))
        .toList();
  }

  Future<List<DersuUrlModel>> fetchDictionary() async {
    var client = await getClient();
    var res = await client.get(dictionaryUrl);
    client.close();
    return (res.data['data']['dictionaries'] as List)
        .map<DersuUrlModel>((json) => DersuUrlModel.fromJson(json))
        .toList();
  }
}
