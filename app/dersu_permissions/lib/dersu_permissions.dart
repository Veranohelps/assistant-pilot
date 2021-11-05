import 'dart:async';

import 'package:flutter/services.dart';

class DersuPermissions {
  static const MethodChannel _channel = MethodChannel('dersu_permissions');

  static Future<DersuPermissionsStatus> requestPermissions() async {
    String currentStatus = await _getLocationStatus();
    if (currentStatus == "not_determined") {
      return await _requestPermission();
    }
    return _convertStatus(currentStatus);
  }

  static void openSettings() {
    _channel.invokeMethod('open_settings');
  }

  static Future<String> _getLocationStatus() async {
    try {
      String status = await _channel.invokeMethod('get_location_status');
      return status;
    } on PlatformException {
      return "error";
    }
  }

  static Future<DersuPermissionsStatus> _requestPermission() async {
    try {
      String status = await _channel.invokeMethod('request_permission');
      return _convertStatus(status);
    } on PlatformException {
      return DersuPermissionsStatus.error;
    }
  }

  static DersuPermissionsStatus _convertStatus(String status) {
    if (status == 'always') {
      return DersuPermissionsStatus.always;
    } else if (status == 'authorized_when_in_use') {
      return DersuPermissionsStatus.authorizedWhenInUse;
    } else if (status == 'denied') {
      return DersuPermissionsStatus.denied;
    }
    return DersuPermissionsStatus.error;
  }
}

enum DersuPermissionsStatus {
  always,
  denied,
  authorizedWhenInUse,
  error,
}
