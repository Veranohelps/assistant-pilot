import 'dart:convert';

import 'package:app/model/expedition.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

class NetworkRepository {
  Future<List<Expedition>> fetchExpeditions() async {
    String DERSU_API_BASE_URL = env['DERSU_API_BASE_URL']!;
    final response = await http.get(Uri.parse(DERSU_API_BASE_URL + "/"));
    return compute(parseExpeditions, response.body);
  }

  Future<DersuRoute> fetchRoute(String url) async {
    print("About to load route from: $url");
    final response = await http.get(Uri.parse(url));
    return compute(parseRoute, response.body);
  }
}

List<Expedition> parseExpeditions(String responseBody) {
  final parsedExpeditions = jsonDecode(responseBody)['expeditions'] as List;
  return parsedExpeditions
      .map<Expedition>((json) => Expedition.fromJson(json))
      .toList();
}

DersuRoute parseRoute(String responseBody) {
  final parsed = jsonDecode(responseBody);
  return DersuRoute.fromJson(parsed);
}
