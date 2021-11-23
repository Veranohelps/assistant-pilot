import 'dart:convert';

import 'package:app/logic/api_maps/dersu_api.dart';
import 'package:app/logic/forms/create_expedition/dto/create_expedition.dart';
import 'package:app/logic/models/expedition.dart';

import 'helpers.dart';

const createUrl = '/expedition/create';

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

    var expedition = res.data['data']['expedition'];
    expedition['routes'] = expedition['routes']
        .map((route) => formatRoutesResponse(route))
        .toList();
    return ExpeditionFull.fromJson(expedition);
  }
}
