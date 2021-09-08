import 'package:app/config/get_it_config.dart';
import 'package:flutter/material.dart';

class AnalyticsConfig extends StatelessWidget {
  const AnalyticsConfig({
    Key? key,
    required this.child,
  }) : super(key: key);

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (_, constraints) {
        getIt<Analitics>().init(constraints.maxWidth);
        return child;
      },
    );
  }
}
