import 'dart:convert';

import 'package:app/config/hive_config.dart';
import 'package:app/logic/api_maps/expeditions.dart';
import 'package:app/logic/models/expedition_event.dart';
import 'package:app/logic/models/geo_json.dart';
import 'package:hive_flutter/hive_flutter.dart';

class ExpeditionLogService {
  ExpeditionLogService(this.expeditionId) {
    var history = box.values
        .map((string) => ExpeditionEvent.fromJson(json.decode(string)))
        .toList();

    eventHistory.addAll(history);
  }

  final String expeditionId;

  final api = ExpeditionsApi();
  var box = Hive.box(HiveContants.expeditionLog.txt);

  final List<ExpeditionEvent> eventHistory = [];

  Future<void> begin(PointCoordinates coordinates) async {
    final isStart =
        eventHistory.any((e) => e.type == ExpeditionEventType.start);

    final event = ExpeditionEvent(
      coordinates: coordinates,
      type: isStart ? ExpeditionEventType.start : ExpeditionEventType.location,
      dateTime: DateTime.now(),
    );

    _saveEvent(event);

    try {
      isStart ? api.startExpedition(expeditionId, event) : ping(event);
    } catch (e) {
      print(e);
    }
  }

  Future<void> ping(ExpeditionEvent event) async {
    _saveEvent(event);
  }

  Future<bool> finish(PointCoordinates coordinates) async {
    final event = ExpeditionEvent(
      coordinates: coordinates,
      type: ExpeditionEventType.finish,
      dateTime: DateTime.now(),
    );

    eventHistory.add(event);

    var res = true;
    try {
      await api.finishExpedition(expeditionId, eventHistory);
    } catch (e) {
      res = false;
    } finally {}

    box.clear();

    return res;
  }

  Future<void> _saveEvent(ExpeditionEvent event) async {
    eventHistory.add(event);
    await box.add(json.encode(event.toJson()));
  }
}
