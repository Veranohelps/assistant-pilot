import 'dart:convert';

import 'package:app/logic/api_maps/dersu_api.dart';
import 'package:app/logic/forms/create_expedition/dto/create_expedition.dart';
import 'package:app/logic/models/expedition.dart';

import 'helpers.dart';

const createUrl = '/expedition/create';

class ExpeditionsApi extends PrivateDersuApi {
  Future<void> create(ExpeditionDto expeditionData) async {
    final client = await getClient();
    await client.post(createUrl, data: jsonEncode(expeditionData));
    client.close();
  }

  Future<ExpeditionFull> loadExpedion(String url) async {
    final client = await getClient();
    var res = await client.get(url);
    client.close();

    return ExpeditionFull.fromJson(_optimizeJson(res.data));
  }

  Future<void> reject(String id) async {
    final client = await getClient();
    await client.patch('/expedition/$id/user/reject');
    client.close();
  }

  Future<void> accept(String id) async {
    final client = await getClient();
    await client.patch('/expedition/$id/user/accept');
    client.close();
  }

  Future<void> leave(String id) async {
    final client = await getClient();
    await client.patch('/expedition/$id/user/exit');
    client.close();
  }

  Future<void> update(String id, ExpeditionDto expeditionData) async {
    final client = await getClient();
    await client.patch('/expedition/$id/update', data: expeditionData);
    client.close();
  }
}

// remove reduntant json layers...
Map<String, dynamic> _optimizeJson(Map<String, dynamic> json) {
  var expedition = json['data']['expedition'];
  expedition['routes'] =
      expedition['routes'].map((route) => formatRoutesResponse(route)).toList();

  var users = expedition["users"]
      .map((json) => json['user']
        ..["isOwner"] = json["isOwner"]
        ..["inviteStatus"] = json["inviteStatus"])
      .toList();
  expedition.removeWhere((key, value) => key == "invites");
  expedition['users'] = users;

  return expedition;
}
