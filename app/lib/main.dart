import 'package:app/app.dart';
import 'package:app/config/localization.dart';
import 'package:app/config/analytics_config.dart';
import 'package:app/ui/pages/error/error.dart';
import 'package:bloc/bloc.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_config/flutter_config.dart';

import 'config/bloc_config.dart';
import 'config/bloc_observer.dart';
import 'config/brand_theme.dart';
import 'config/get_it_config.dart';
import 'config/global_error_handling.dart';
import 'config/hive_config.dart';

var apiDefaultLog = false;

Future<void> main() async {
  globalErrorHandling(
    () async {
      Bloc.observer = SimpleBlocObserver();

      WidgetsFlutterBinding.ensureInitialized();

      await EasyLocalization.ensureInitialized();
      await FlutterConfig.loadEnvVariables();
      await HiveConfig.init();
      await getItSetup();
      await initHydratedBloc();
    },
    () => runApp(Localization(child: _Main())),
  );
}

class _Main extends StatelessWidget {
  const _Main({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocAndProviderConfig(
      child: AnalyticsConfig(
        child: MaterialApp(
          locale: context.locale,
          supportedLocales: context.supportedLocales,
          localizationsDelegates: context.localizationDelegates,
          navigatorKey: getIt.get<NavigationService>().navigatorKey,
          debugShowCheckedModeBanner: false,
          theme: brandTheme,
          title: 'Dersu Assistant App',
          home: App(),
          navigatorObservers: [getIt.get<Analitics>().navigatorObserver],
          builder: (BuildContext context, Widget? widget) {
            ErrorWidget.builder =
                (FlutterErrorDetails errorDetails) => ErrorScreen(
                      error: Exception('...rendering error'),
                    );
            return widget!;
          },
        ),
      ),
    );
  }
}
