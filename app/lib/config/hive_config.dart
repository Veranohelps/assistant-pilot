import 'package:hive/hive.dart';
import 'package:hive_flutter/hive_flutter.dart';

class HiveConfig{
  static Future init() async {
    return Hive.initFlutter();
  }
}