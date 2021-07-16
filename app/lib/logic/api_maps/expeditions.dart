import 'package:app/logic/api_maps/dersu_api.dart';
import 'package:app/logic/model/expedition.dart';

class ExpeditionsApi extends DersuApi {
  Future<List<Expedition>> fetchExpeditions() async {
    var client = await getClient();
    var res = await client.get('/');
    client.close();
    return res.data['expeditions']
        .map<Expedition>((json) => Expedition.fromJson(json))
        .toList();
  }
}
