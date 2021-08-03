import 'package:app/logic/model/console_message.dart';
import 'package:hive/hive.dart';
import 'package:hive_flutter/hive_flutter.dart';

class HiveConfig {
  static Future<void> init() async {
    await Hive.initFlutter();

    Hive.registerAdapter(ConsoleMessageAdapter());
    Hive.registerAdapter(MessageTypeAdapter());

    await Hive.openBox<ConsoleMessage>(HiveContants.console.txt);
    await Hive.openBox(HiveContants.geoConfig.txt);
  }
}

enum HiveContants { console, geoConfig, waypointPrecision }

extension HiveContantseExt on HiveContants {
  String get txt => this.toString().split('.')[1];
}
