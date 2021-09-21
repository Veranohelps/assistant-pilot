import 'package:app/logic/api_maps/dersu_api.dart';
import 'package:app/logic/model/expedition.dart';

class ExpeditionsApi extends PrivateDersuApi {
  Future<List<Expedition>> fetchExpeditions() async {
    var client = await getClient();
    var res = await client.get('/expedition');
    client.close();
    return (res.data['data']['expeditions'] as List)
        .map<Expedition>((json) => Expedition.fromJson(json))
        .toList();
  }
}
