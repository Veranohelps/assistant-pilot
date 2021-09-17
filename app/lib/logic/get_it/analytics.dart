import 'package:app/logic/api_maps/plausible.dart';
import 'package:flutter/material.dart';

class Analitics {
  Analitics() {
    navigatorObserver = NavigationHistoryObserver(sendScreensEvent);
  }

  final plausibleApi = PlausibleApi();
  late int screenSize;

  void init(double width) {
    screenSize = width.toInt();
  }

  void sendCustomEvent({
    required CustomEvents type,
    String? action,
    String? label,
    value,
  }) {
    print('type: $type, action: $action, label: $label, value: $value');

    plausibleApi.sendPlausibleEvent(
      type: type,
      action: action,
      label: label,
      value: value,
    );
  }

  Future<void> sendErrorEvent({
    String? action,
    String? label,
    value,
  }) async {
    await plausibleApi.sendPlausibleEvent(
      type: CustomEvents.error,
      action: action,
      label: label,
      value: value,
    );
  }

  void sendScreensEvent({
    required PageEventTypes action,
    required String name,
    String? value,
  }) {
    sendCustomEvent(
      type: CustomEvents.page,
      action: action.toString().split('.')[1],
      label: name,
      value: value,
    );
  }

  late NavigationHistoryObserver navigatorObserver;
}

enum CustomEvents {
  page,
  click,
  error,
  create,
}

enum PageEventTypes { open, close, replace, tab }

typedef TrackPageChanges = void Function({
  required PageEventTypes action,
  required String name,
  String? value,
});

class NavigationHistoryObserver extends NavigatorObserver {
  NavigationHistoryObserver(this.track);

  late TrackPageChanges track;

  @override
  void didPop(Route<dynamic> route, Route<dynamic>? previousRoute) {
    track(
      action: PageEventTypes.close,
      name: route.settings.name ?? 'no name',
    );
  }

  @override
  void didPush(Route<dynamic> route, Route<dynamic>? previousRoute) {
    track(
      action: PageEventTypes.open,
      name: route.settings.name ?? 'no name',
      value: route.settings.arguments?.toString(),
    );
  }
}
