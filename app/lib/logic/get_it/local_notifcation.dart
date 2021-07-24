import 'package:app/config/get_it_config.dart';
import 'package:app/logic/model/console_message.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:notification_permissions/notification_permissions.dart';
import 'package:package_info/package_info.dart';

class NotificationService {
  bool _isInit = false;
  bool get isInit => _isInit;

  Future<void> init() async {
    if (_isInit) {
      return;
    }
    final packageInfo = await PackageInfo.fromPlatform();

    androidPlatformChannelSpecifics = AndroidNotificationDetails(
      packageInfo.packageName,
      packageInfo.appName,
      '',
      importance: Importance.max,
      priority: Priority.high,
    );

    await flutterLocalNotificationsPlugin.initialize(
      InitializationSettings(
        android: AndroidInitializationSettings('@mipmap/ic_launcher'),
        iOS: IOSInitializationSettings(
          requestSoundPermission: true,
          requestBadgePermission: true,
          requestAlertPermission: true,
        ),
        macOS: null,
      ),
      onSelectNotification: null,
    );

    _requestPermissions();

    _isInit = true;
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

  Future<void> showNotification({
    required String title,
    required String text,
  }) async {
    if (!_isInit) {
      await init();
    }
    reAskPermitionsIfNeeded();
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
    );
  }

  Future<void> reAskPermitionsIfNeeded() async {
    var permission =
        await NotificationPermissions.getNotificationPermissionStatus();
    if (permission == PermissionStatus.denied) {
      NotificationPermissions.requestNotificationPermissions(
        iosSettings: const NotificationSettingsIos(
          sound: true,
          badge: true,
          alert: true,
        ),
      );
    }
  }

  final flutterLocalNotificationsPlugin = FlutterLocalNotificationsPlugin();

  late AndroidNotificationDetails androidPlatformChannelSpecifics;
  late NotificationDetails platformChannelSpecifics;

  /// configuration:

}
