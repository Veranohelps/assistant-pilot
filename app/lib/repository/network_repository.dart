import 'dart:convert';

import 'package:app/model/expedition.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;

class NetworkRepository {
  Future<List<Expedition>> fetchExpeditions() async {
    String DERSU_API_BASE_URL = env['DERSU_API_BASE_URL']!;
    final response = await http.get(Uri.http(DERSU_API_BASE_URL, "/"));
    return compute(parseExpeditions, response.body);
  }
}

List<Expedition> parseExpeditions(String responseBody) {
  final parsed =
      jsonDecode(responseBody)['expeditions'].cast<Map<String, dynamic>>();
  return parsed.map<Expedition>((json) => Expedition.fromJson(json)).toList();
}
