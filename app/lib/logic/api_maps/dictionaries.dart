import 'package:app/logic/api_maps/dersu_api.dart';
import 'package:app/logic/models/activity_type.dart';
import 'package:app/logic/models/levels.dart';
import 'package:app/logic/models/url.dart';
import 'package:app/logic/models/route_origin.dart';

final dictionaryUrl = '/dictionary';

class DictionariesApi extends PrivateDersuApi {
  Future<List<ActivityType>> fetchActiveTypes() async {
    var allDictionaries = await getDictionaryUrls();
    print(allDictionaries);
    var activityTypesUrl =
        allDictionaries.firstWhere((element) => element.id == 'activity-type');

    var client = await getClient();
    var res = await client.get(activityTypesUrl.url);
    print(res.data);
    client.close();
    return (res.data['data']['activityTypes'] as List)
        .map<ActivityType>((json) => ActivityType.fromJson(json))
        .toList();
  }

  Future<List<RouteOrigin>> fetchRouteOrigins() async {
    var allDictionaries = await getDictionaryUrls();
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
    var allDictionaries = await getDictionaryUrls();
    var levelUrl =
        allDictionaries.firstWhere((element) => element.id == 'skill');
    var client = await getClient();
    var res = await client.get(levelUrl.url);
    client.close();
    return (res.data['data']['skills'] as List)
        .map<Category>((json) => Category.fromJson(json))
        .toList();
  }

  Future<List<DersuUrlModel>> getDictionaryUrls() async {
    if (_allDictionaries == null) {
      var client = await getClient();
      var res = await client.get(dictionaryUrl);
      client.close();
      _allDictionaries = (res.data['data']['dictionaries'] as List)
          .map<DersuUrlModel>((json) => DersuUrlModel.fromJson(json))
          .toList();
    }
    return _allDictionaries!;
  }

  List<DersuUrlModel>? _allDictionaries;
}
