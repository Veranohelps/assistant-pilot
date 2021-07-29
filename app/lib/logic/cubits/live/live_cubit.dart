import 'package:app/logic/model/expedition.dart';
import 'package:app/logic/model/route.dart';
import 'package:equatable/equatable.dart';
import 'package:hydrated_bloc/hydrated_bloc.dart';

part 'live_state.dart';

class LiveCubit extends HydratedCubit<LiveState> {
  LiveCubit() : super(IsNotLive());

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

  @override
  LiveState fromJson(Map<String, dynamic> json) {
    if (json['isLive'] != null && json['isLive']) {
      return IsLive(
        route: DersuRoute.fromJson(json['route']),
        expedition: Expedition.fromJson(json['expedition']),
      );
    }

    return IsNotLive();
  }

  @override
  Map<String, dynamic> toJson(LiveState state) {
    if (state is IsLive) {
      return {
        'isLive': true,
        'route': state.route.toJson(),
        'expedition': state.expedition.toJson(),
      };
    }

    return {'isLive': false};
  }
}
