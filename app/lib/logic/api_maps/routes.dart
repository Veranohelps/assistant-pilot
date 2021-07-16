import 'package:app/logic/api_maps/dersu_api.dart';
import 'package:app/logic/model/route.dart';

final routesUrl = '/routes';

class RoutesApi extends DersuApi {
  Future<DersuRoute> fetchRoute(String id) async {
    var client = await getClient();
    var res = await client.get('$routesUrl/$id');
    client.close();
    return DersuRoute.fromJson(res.data);
  }
}
