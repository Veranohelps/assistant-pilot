part of 'live_cubit.dart';

abstract class LiveState extends Equatable {
  @override
  List<Object?> get props => [];
}

class LiveStateOff extends LiveState {}

class LiveStateOn3x3 extends LiveStateOn {
  final Waypoint waypoint;
  LiveStateOn3x3({required this.waypoint, expedition, startTime})
      : super(expedition: expedition, startTime: startTime);

  @override
  List<Object?> get props => [expedition, startTime, waypoint];
}

class LiveStateOn extends LiveState {
  final ExpeditionFull expedition;
  final DateTime startTime;

  LiveStateOn({
    required this.expedition,
    required this.startTime,
  });

  @override
  List<Object?> get props => [expedition, startTime];

  Map<String, dynamic> toMap() {
    return {
      'expedition': expedition.toJson(),
      'startTime': startTime.millisecondsSinceEpoch,
    };
  }

  factory LiveStateOn.fromMap(Map<String, dynamic> map) {
    return LiveStateOn(
      expedition: ExpeditionFull.fromJson(map['expedition']),
      startTime: DateTime.fromMillisecondsSinceEpoch(map['startTime']),
    );
  }

  String toJson() => json.encode(toMap());

  factory LiveStateOn.fromJson(String source) {
    return LiveStateOn.fromMap(json.decode(source));
  }
}
