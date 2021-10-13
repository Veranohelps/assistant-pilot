import 'dart:convert';

import 'package:app/logic/api_maps/dersu_api.dart';
import 'package:app/logic/models/dto/create_expedition.dart';

final createUrl = '/expedition/create';

class ExpeditionsApi extends PrivateDersuApi {
  Future<void> create(CreateExpeditionDto expeditionData) async {
    final client = await getClient();
    await client.post(createUrl, data: jsonEncode(expeditionData));
    client.close();
  }
}
