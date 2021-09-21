import 'package:app/logic/api_maps/plausible.dart';
import 'package:flutter/material.dart';

class Analitics {
  Analitics() {
    navigatorObserver = NavigationHistoryObserver(sendScreensEvent);
  }

  final plausibleApi = PlausibleApi();
  int? screenSize;

  void init(double width) {
    screenSize = width.toInt();
  }

  Future<void> _sendCustomEvent({
    required CustomEvents type,
    String? action,
    String? label,
    value,
  }) async {
    print('type: $type, action: $action, label: $label, value: $value');

    await plausibleApi.sendPlausibleEvent(
      type: type,
      action: action,
      label: label,
      value: value,
    );
  }

  void sendClickEvent({
    required String action,
    String? label,
    value,
  }) {
    _sendCustomEvent(
      type: CustomEvents.click,
      action: action,
      label: label,
      value: value,
    );
  }

  void sendCubitEvent({
    required String action,
    String? label,
    value,
  }) {
    _sendCustomEvent(
      type: CustomEvents.logic,
      action: action,
      label: label,
      value: value,
    );
  }

  Future<void> sendErrorEvent({
    String? action,
    String? label,
    value,
  }) {
    return _sendCustomEvent(
      type: CustomEvents.error,
      action: action,
      label: label,
      value: value,
    );
  }

  Future<void> sendScreensEvent({
    required PageEventTypes action,
    required String name,
    String? value,
  }) async {
    await _sendCustomEvent(
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
  logic,
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
