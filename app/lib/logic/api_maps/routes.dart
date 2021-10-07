import 'package:app/logic/api_maps/dersu_api.dart';
import 'package:app/logic/models/route.dart';

final routesUrl = '/route';

class RoutesApi extends PrivateDersuApi {
  Future<List<DersuRouteShort>> routes() async {
    var client = await getClient();
    var res = await client.get('/route');
    client.close();
    return (res.data['data']['route'] as List)
        .map<DersuRouteShort>((json) => DersuRouteShort.fromJson(json))
        .toList();
  }

  Future<DersuRouteFull> route(String url) async {
    var client = await getClient();
    var res = await client.get(url);
    client.close();
    return DersuRouteFull.fromJson(res.data['data']['route']);
  }
}
