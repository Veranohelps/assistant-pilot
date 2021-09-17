import 'dart:io';

import 'package:app/config/brand_colors.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:flutter/material.dart';
import 'package:app/utils/extensions/text_extension.dart';
import 'package:app/utils/extensions/extensions.dart';

class ErrorScreen extends StatelessWidget {
  const ErrorScreen({Key? key, this.error, this.stackTrace}) : super(key: key);

  final Object? error;
  final StackTrace? stackTrace;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        body: Stack(
          children: [
            Positioned(
              top: 10,
              right: 10,
              child: GestureDetector(
                onLongPress: () {
                  exit(1);
                },
                child: Container(
                  padding: EdgeInsets.all(10),
                  decoration: BoxDecoration(
                      color: BrandColors.red,
                      borderRadius: BorderRadius.circular(10)),
                  child: Text(LocaleKeys.gestures_press_and_hold.tr())
                      .withColor(Colors.white),
                ),
              ),
            ),
            Center(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text('🤯 🤬 😵', style: TextStyle(fontSize: 50)),
                      Text(LocaleKeys.errors_fatal.tr()).h1,
                      Text(error?.toString() ?? LocaleKeys.errors_fatal.tr())
                          .h4,
                      if (stackTrace != null) ...[
                        Text('Stack trace: ').h6,
                        Text(stackTrace.toString()).p2,
                      ],
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
