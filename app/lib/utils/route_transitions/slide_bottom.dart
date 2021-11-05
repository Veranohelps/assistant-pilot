import 'package:flutter/material.dart';

Widget Function(BuildContext, Animation<double>, Animation<double>) pageBuilder(
        Widget widget) =>
    (
      BuildContext context,
      Animation<double> animation,
      Animation<double> secondaryAnimation,
    ) =>
        widget;

Widget transitionsBuilder(
  BuildContext context,
  Animation<double> animation,
  Animation<double> secondaryAnimation,
  Widget child,
) {
  return SlideTransition(
    position: Tween<Offset>(
      begin: const Offset(0, 1),
      end: Offset.zero,
    ).animate(animation),
    child: Container(
      decoration: animation.isCompleted
          ? null
          : const BoxDecoration(
              border: Border(
                bottom: BorderSide(
                  color: Colors.black,
                ),
              ),
            ),
      child: child,
    ),
  );
}

class SlideBottomRoute extends PageRouteBuilder {
  SlideBottomRoute(this.widget)
      : super(
          pageBuilder: pageBuilder(widget),
          transitionDuration: const Duration(milliseconds: 150),
          reverseTransitionDuration: const Duration(milliseconds: 150),
          transitionsBuilder: transitionsBuilder,
        );

  final Widget widget;
}
