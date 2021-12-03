import 'package:app/logic/api_maps/dersu_api.dart';
import 'package:app/logic/api_maps/helpers.dart';
import 'package:app/logic/models/route.dart';

const routesUrl = '/route';

class RoutesApi extends PrivateDersuApi {
  Future<List<DersuRouteShort>> routes() async {
    var client = await getClient();
    var res = await client.get(routesUrl);
    client.close();

    return (res.data['data']['routes'] as List)
        .map<DersuRouteShort>((json) => DersuRouteShort.fromJson(json))
        .toList();
  }

  Future<DersuRouteFull> route(String url) async {
    var client = await getClient();
    var res = await client.get(url);
    client.close();

    var route = res.data['data']['route'] as Map<String, dynamic>;

    return DersuRouteFull.fromJson(formatRoutesResponse(route));
  }
}
