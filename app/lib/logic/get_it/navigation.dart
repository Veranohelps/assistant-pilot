import 'package:flutter/material.dart';

class NavigationService {
  final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();
  NavigatorState get navigator => navigatorKey.currentState!;

  void showPopUpDialog(AlertDialog dialog) {
    final context = navigatorKey.currentState!.overlay!.context;

    showDialog(
      context: context,
      builder: (_) => dialog,
    );
  }

  void showTost(String dialog) {
    final context = navigatorKey.currentState!.overlay!.context;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(dialog),
        duration: const Duration(seconds: 1),
      ),
    );
  }
}
