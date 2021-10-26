import 'dart:convert';

import 'package:app/config/hive_config.dart';
import 'package:app/logic/models/expedition.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:hive_flutter/hive_flutter.dart';

part 'live_state.dart';

class LiveCubit extends Cubit<LiveState> {
  LiveCubit() : super(LiveStateOff());

  var box = Hive.box(HiveContants.hydratedCubits.txt);

  void load() async {
    var saved = box.get(HiveContants.liveExpedition.txt);
    if (saved != null) {
      emit(LiveStateOn.fromJson(saved));
    }
  }

  Future<void> set(ExpeditionFull expeditionFull) async {
    var newState = LiveStateOn(
      expedition: expeditionFull,
      startTime: DateTime.now(),
    );
    await box.put(HiveContants.liveExpedition.txt, newState.toJson());

    emit(newState);
  }

  Future<void> clean() async {
    await box.put(HiveContants.liveExpedition.txt, null);
    emit(LiveStateOff());
  }
}
