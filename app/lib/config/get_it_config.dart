import 'package:get_it/get_it.dart';

import 'package:app/logic/get_it/navigation.dart';
import 'package:app/logic/get_it/local_notifcation.dart';
import 'package:app/logic/get_it/console.dart';

export 'package:app/logic/get_it/navigation.dart';
export 'package:app/logic/get_it/local_notifcation.dart';
export 'package:app/logic/get_it/console.dart';

final getIt = GetIt.instance;

Future<void> getItSetup() async {
  getIt.registerSingleton<NavigationService>(NavigationService());
  getIt.registerSingleton<NotificationService>(NotificationService());
  getIt.registerSingleton<ConsoleService>(ConsoleService());

  await getIt.allReady();
}
