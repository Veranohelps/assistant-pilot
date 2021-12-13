import 'package:flutter/material.dart';

class NavigationService {
  final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();
  NavigatorState get navigator => navigatorKey.currentState!;

  Future<void> showPopUpDialog(AlertDialog dialog) async {
    final context = navigatorKey.currentState!.overlay!.context;

    return await showDialog(
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
