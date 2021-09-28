import 'dart:convert';

import 'package:app/config/hive_config.dart';
import 'package:app/logic/model/expedition.dart';
import 'package:app/logic/model/route.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive_flutter/hive_flutter.dart';

part 'live_state.dart';

class LiveCubit extends Cubit<LiveState> {
  LiveCubit() : super(IsNotLive()) {
    load();
  }

  final box = Hive.box(HiveContants.hydratedCubits.txt);

  void setLiveOn({
    required Expedition expedition,
    required DersuRoute route,
  }) {
    emit(IsLive(
      route: route,
      expedition: expedition,
    ));
  }

  void setLiveOff() {
    emit(IsNotLive());
  }

  void load() {
    var json =
        jsonDecode(box.get(HiveContants.liveCubit.txt, defaultValue: '{}'));
    if (json['isLive'] != null && json['isLive']) {
      emit(IsLive(
        route: DersuRoute.fromJson(json['route']),
        expedition: Expedition.fromJson(json['expedition']),
      ));
    }
  }

  void saveState(LiveState state) {
    Map<String, dynamic> json;
    if (state is IsLive) {
      json = {
        'isLive': true,
        'route': state.route.toJson(),
        'expedition': state.expedition,
      };
    } else {
      json = {'isLive': false};
    }

    box.put(HiveContants.liveCubit.txt, jsonEncode(json));
  }

  @override
  void onChange(Change<LiveState> change) {
    super.onChange(change);
    final state = change.nextState;
    try {
      saveState(state);
    } catch (error, stackTrace) {
      onError(error, stackTrace);
    }
  }
}
