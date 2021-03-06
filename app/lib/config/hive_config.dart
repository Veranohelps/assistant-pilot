import 'dart:convert';
import 'dart:typed_data';
import 'package:app/logic/models/console_message.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

// ignore: constant_identifier_names
const DERSU_HIVE_ENCRYPTION_KEY = 'dersuHiveEncryptionKey';

class HiveConfig {
  static Future<void> init() async {
    await Hive.initFlutter();

    Hive.registerAdapter(ConsoleMessageAdapter());
    Hive.registerAdapter(MessageTypeAdapter());

    await Hive.openBox<ConsoleMessage>(HiveContants.console.txt);
    await Hive.openBox(HiveContants.geoConfig.txt);
    await Hive.openBox(HiveContants.hydratedCubits.txt);
    await Hive.openBox(HiveContants.expeditionLog.txt);

    var encryptionKey = await getEncryptionKey();
    await Hive.openBox(
      HiveContants.authentication.txt,
      encryptionCipher: HiveAesCipher(encryptionKey),
    );
  }

  static Future<Uint8List> getEncryptionKey() async {
    const FlutterSecureStorage secureStorage = FlutterSecureStorage();
    var containsEncryptionKey = await secureStorage.containsKey(
      key: DERSU_HIVE_ENCRYPTION_KEY,
    );
    if (!containsEncryptionKey) {
      var key = Hive.generateSecureKey();
      await secureStorage.write(
        key: DERSU_HIVE_ENCRYPTION_KEY,
        value: base64UrlEncode(key),
      );
    }
    var key = await secureStorage.read(
      key: DERSU_HIVE_ENCRYPTION_KEY,
    ) as String;

    return base64Url.decode(key);
  }
}

enum HiveContants {
  console,
  geoConfig,
  waypointPrecision,
  authentication,
  refreshToken,
  hydratedCubits,
  liveExpedition,
  expeditionLog
}

extension HiveContantseExt on HiveContants {
  String get txt => toString().split('.')[1];
}
