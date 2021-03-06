import 'package:app/logic/get_it/analytics.dart';
import 'package:app/logic/get_it/auth_token.dart';
import 'package:app/logic/get_it/connectivity.dart';
import 'package:app/logic/get_it/device_info/device_info.dart';
import 'package:app/logic/get_it/geofence.dart';
import 'package:get_it/get_it.dart';
import 'package:app/logic/get_it/navigation.dart';
import 'package:app/logic/get_it/local_notifcation.dart';
import 'package:app/logic/get_it/console.dart';

export 'package:app/logic/get_it/analytics.dart';
export 'package:app/logic/get_it/navigation.dart';
export 'package:app/logic/get_it/local_notifcation.dart';
export 'package:app/logic/get_it/console.dart';
export 'package:app/logic/get_it/device_info/device_info.dart';

final getIt = GetIt.instance;

Future<void> preRenderGetItSetup() async {
  getIt.registerSingleton<Analitics>(Analitics());
  getIt.registerSingleton<NavigationService>(NavigationService());
  getIt.registerSingleton<NotificationService>(NotificationService());
  getIt.registerSingleton<AuthTokenService>(AuthTokenService());
  getIt.registerSingleton<DeviceInfoService>(DeviceInfoService());

  getIt.registerSingletonAsync<ConsoleService>(() async {
    var service = ConsoleService();
    await service.load();
    return service;
  });

  getIt.registerSingletonAsync<ConnectivityService>(() async {
    var service = ConnectivityService();
    await service.init();
    return service;
  });

  await getIt.allReady();
}

Future<void> afterFirstRenderGetItSetup() async {
  getIt.registerSingleton<GeofenceService>(GeofenceService());
}
