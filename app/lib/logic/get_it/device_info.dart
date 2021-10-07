import 'dart:io';

import 'package:app/logic/models/device.dart';
import 'package:app/utils/time.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';

class DeviceInfoService {
  Device? device;
  Locale? locale;

  Future<void> init(double height, double width) async {
    final DeviceInfoPlugin deviceInfoPlugin = DeviceInfoPlugin();
    late bool? isPhysicalDevice;
    late String manufacturer;
    late String operatingSystem;
    late String osVersion;

    late String model;
    if (Platform.isAndroid) {
      final androidInfo = await deviceInfoPlugin.androidInfo;

      operatingSystem = 'Android';
      isPhysicalDevice = androidInfo.isPhysicalDevice;
      manufacturer = androidInfo.manufacturer ?? 'xxx';
      osVersion = androidInfo.version.release ?? 'xxx';
      model = androidInfo.model ?? 'xxx';
    } else if (Platform.isIOS) {
      final iosInfo = await deviceInfoPlugin.iosInfo;

      operatingSystem = 'iOS';
      isPhysicalDevice = iosInfo.isPhysicalDevice;
      manufacturer = 'Apple Inc.';
      osVersion = iosInfo.systemVersion ?? 'xxx';
      model = iosInfo.model ?? 'xxx';
    } else {
      throw PlatformException(code: 'wrong os');
    }

    device = Device(
      screenWidth: width,
      screenHeight: height,
      isPhysicalDevice: isPhysicalDevice,
      manufacturer: manufacturer,
      operatingSystem: operatingSystem,
      timeZone: getGmtTimeZone(),
      osVersion: osVersion,
      model: model,
    );
  }

  void setLocale(Locale locale) {
    this.locale = locale;
  }

  String deviceInfoString() {
    if (device == null) return 'xxx';

    final dataMap = {
      "OperatingSystem": device!.operatingSystem,
      "OsVersion": device!.osVersion,
      "Model": device!.model,
      "Manufacturer": device!.manufacturer,
      "PhysicalDevice": device!.isPhysicalDevice,
      "ScreenWidth": device!.screenWidth,
      "ScreenHeight": device!.screenHeight,
      "TimeZone": device!.timeZone,
    };

    return dataMap.keys
        .toList()
        .map((key) => '$key:${dataMap[key]}')
        .join(', ');
  }
}
