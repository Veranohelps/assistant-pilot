import 'dart:async';

import 'package:app/config/theme_typo.dart';
import 'package:app/utils/extensions/duration.dart';
import 'package:flutter/material.dart';

class ExpedtitionTimer extends StatefulWidget {
  const ExpedtitionTimer({
    Key? key,
    required this.startTime,
  }) : super(key: key);

  final DateTime startTime;
  @override
  _ExpedtitionTimerState createState() => _ExpedtitionTimerState();
}

class _ExpedtitionTimerState extends State<ExpedtitionTimer> {
  @override
  void initState() {
    timer = Timer.periodic(Duration(seconds: 1), (_) => setState(() {}));
    super.initState();
  }

  late final Timer timer;

  @override
  void dispose() {
    timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    var duration = DateTime.now().difference(widget.startTime);
    return Text(
      'En ruta ${duration.toDayHourMinuteSecondFormat()}',
      style: ThemeTypo.subtitle2.copyWith(height: 1.2),
    );
  }
}
