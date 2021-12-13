import 'dart:convert';

import 'package:app/config/get_it_config.dart';
import 'package:app/config/hive_config.dart';
import 'package:app/logic/models/expedition.dart';
import 'package:app/logic/models/waypoint.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:hive_flutter/hive_flutter.dart';

part 'live_state.dart';

class LiveCubit extends Cubit<LiveState> {
  LiveCubit() : super(LiveStateOff());

  var box = Hive.box(HiveContants.hydratedCubits.txt);

  void _onNotification() {
    if (state is LiveStateOn || state is LiveStateOn3x3) {
      var payload = getIt<NotificationService>().notificationPayload;

      if (payload != null) {
        var liveState = state as LiveStateOn;
        var waypointId = payload.split(',').first;
        var waypoint = (state as LiveStateOn)
            .expedition
            .routes
            .first
            .waypoints
            .where((waypoint) => waypoint.id == waypointId)
            .first;
        var newState = LiveStateOn3x3(
            waypoint: waypoint,
            expedition: liveState.expedition,
            startTime: liveState.startTime);
        emit(newState);
      }
    }
  }

  void load() async {
    var saved = box.get(HiveContants.liveExpedition.txt);
    if (saved != null) {
      emit(LiveStateOn.fromJson(saved));
    }
  }

  void closeThreeByThree() {
    var currentState = state as LiveStateOn3x3;
    emit(LiveStateOn(
        expedition: currentState.expedition,
        startTime: currentState.startTime));
  }

  Future<void> set(ExpeditionFull expeditionFull) async {
    var newState = LiveStateOn(
      expedition: expeditionFull,
      startTime: DateTime.now(),
    );
    await box.put(HiveContants.liveExpedition.txt, newState.toJson());
    getIt<NotificationService>().addListener(_onNotification);

    emit(newState);
  }

  Future<void> clean() async {
    await box.put(HiveContants.liveExpedition.txt, null);
    getIt<NotificationService>().removeListener(_onNotification);
    emit(LiveStateOff());
  }
}
