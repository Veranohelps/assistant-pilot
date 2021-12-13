import 'package:app/config/get_it_config.dart';
import 'package:app/logic/models/console_message.dart';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:package_info/package_info.dart';

class NotificationService extends ChangeNotifier {
  bool _isInit = false;
  bool get isInit => _isInit;
  String? _notificationPayload;
  String? get notificationPayload => _notificationPayload;

  Future<void> init() async {
    if (_isInit) {
      return;
    }
    final packageInfo = await PackageInfo.fromPlatform();

    androidPlatformChannelSpecifics = AndroidNotificationDetails(
      packageInfo.packageName,
      packageInfo.appName,
      importance: Importance.max,
      priority: Priority.high,
    );

    await flutterLocalNotificationsPlugin.initialize(
      const InitializationSettings(
        android: AndroidInitializationSettings('@mipmap/ic_launcher'),
        iOS: IOSInitializationSettings(
          requestSoundPermission: true,
          requestBadgePermission: true,
          requestAlertPermission: true,
        ),
        macOS: null,
      ),
      onSelectNotification: _onSelectNotification,
    );

    _requestPermissions();

    _isInit = true;
  }

  void _onSelectNotification(String? payload) {
    if (payload != null) {
      _notificationPayload = payload;
      notifyListeners();
    }
  }

  void _requestPermissions() async {
    await flutterLocalNotificationsPlugin
        .resolvePlatformSpecificImplementation<
            IOSFlutterLocalNotificationsPlugin>()
        ?.requestPermissions(
          alert: true,
          badge: true,
          sound: true,
        );
  }

  Future<void> showNotification(
      {required String title, required String text, String? payload}) async {
    if (!_isInit) {
      await init();
    }
    getIt<ConsoleService>().addMessage(
      ConsoleMessage(text: 'showNotification: ' + title),
    );
    flutterLocalNotificationsPlugin.show(
        0,
        title,
        text,
        NotificationDetails(
          android: androidPlatformChannelSpecifics,
        ),
        payload: payload);
  }

  final flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();

  late AndroidNotificationDetails androidPlatformChannelSpecifics;
  late NotificationDetails platformChannelSpecifics;

  /// configuration:

}
