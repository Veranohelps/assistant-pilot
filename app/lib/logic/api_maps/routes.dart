import 'package:app/logic/api_maps/dersu_api.dart';
import 'package:app/logic/model/route.dart';

final routesUrl = '/route';

class RoutesApi extends PrivateDersuApi {
  Future<DersuRoute> fetchRoute(String url) async {
    var client = await getClient();
    var res = await client.get(url);
    client.close();
    return DersuRoute.fromJson(res.data['data']['route']);
  }
}
