import 'package:flutter/material.dart';

Route materialRoute(Widget widget, [arguments]) => MaterialPageRoute(
      builder: (context) => widget,
      settings: RouteSettings(
        arguments: arguments,
        name: widget.runtimeType.toString(),
      ),
    );

Route noAnimationRoute(Widget widget, [arguments]) => PageRouteBuilder(
      pageBuilder: (context, animation1, animation2) => widget,
      settings: RouteSettings(
        arguments: arguments,
        name: widget.runtimeType.toString(),
      ),
    );

bool canPopHelper(BuildContext context) {
  final ModalRoute<dynamic>? parentRoute = ModalRoute.of(context);
  return parentRoute?.canPop ?? false;
}
