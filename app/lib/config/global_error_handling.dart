import 'dart:async';

import 'dart:ui';

import 'package:app/ui/pages/error/error.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:flutter/widgets.dart';

import 'get_it_config.dart';

typedef VoidFutureOrCallback = FutureOr<void> Function();

void globalErrorHandling(VoidFutureOrCallback init, VoidCallback runApp) {
  runZonedGuarded(
    () async {
      await init();
      FlutterError.onError = (FlutterErrorDetails errorDetails) async {
        getIt<Analitics>().sendErrorEvent(
            action: errorDetails.exception.toString(),
            value: errorDetails.stack.toString());

        getIt<NavigationService>().navigator.push(
              materialRoute(ErrorScreen(
                error: errorDetails.exception,
                stackTrace: errorDetails.stack,
              )),
            );
      };
      runApp();
    },
    (Object error, StackTrace stack) async {
      getIt<Analitics>().sendErrorEvent(
        action: error.toString(),
        value: stack.toString(),
      );
      getIt<NavigationService>().navigator.push(
            materialRoute(ErrorScreen(
              error: error,
              stackTrace: stack,
            )),
          );
    },
  );
}
