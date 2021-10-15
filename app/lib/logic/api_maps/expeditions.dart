import 'dart:convert';

import 'package:app/logic/api_maps/dersu_api.dart';
import 'package:app/logic/models/dto/create_expedition.dart';
import 'package:app/logic/models/expedition.dart';

final createUrl = '/expedition/create';

class ExpeditionsApi extends PrivateDersuApi {
  Future<void> create(CreateExpeditionDto expeditionData) async {
    final client = await getClient();
    await client.post(createUrl, data: jsonEncode(expeditionData));
    client.close();
  }

  Future<ExpeditionFull> loadExpedion(String url) async {
    final client = await getClient();
    var res = await client.get(url);
    client.close();
    return ExpeditionFull.fromJson(res.data['data']['expedition']);
  }
}
