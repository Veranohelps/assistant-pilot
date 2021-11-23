import 'package:app/app.dart';
import 'package:app/config/brand_theme.dart';
import 'package:app/config/localization.dart';
import 'package:app/config/device_info_wrapper.dart';
import 'package:app/ui/pages/errors/basic.dart';
import 'package:app/utils/debug.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_config/flutter_config.dart';
import 'package:overlay_support/overlay_support.dart';
import 'config/bloc_config.dart';
import 'config/get_it_config.dart';
import 'config/global_error_handling.dart';
import 'config/hive_config.dart';

var apiDefaultLog = false;

final hhMMFormat = DateFormat.jm();

Future<void> main() async {
  globalErrorHandling(
    () async {
      WidgetsFlutterBinding.ensureInitialized();
      await EasyLocalization.ensureInitialized();
      await FlutterConfig.loadEnvVariables();
      await HiveConfig.init();
      await preRenderGetItSetup();
      await SystemChrome.setPreferredOrientations(
          [DeviceOrientation.portraitUp]);
    },
    () => runApp(Localization(child: _Main())),
  );
}

class _Main extends StatefulWidget {
  const _Main({Key? key}) : super(key: key);

  @override
  State<_Main> createState() => _MainState();
}

class _MainState extends State<_Main> {
  @override
  void initState() {
    WidgetsBinding.instance!.addPostFrameCallback(_afterLayoutBuild);
    super.initState();
  }

  _afterLayoutBuild(_) {
    afterFirstRenderGetItSetup();
  }

  @override
  Widget build(BuildContext context) {
    return BlocAndProviderConfig(
      child: DeviceInfoWrapper(
        child: OverlaySupport.global(
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
              if (Application.isInReleaseMode) {
                ErrorWidget.builder =
                    (FlutterErrorDetails errorDetails) => BasicErrorScreen(
                          error: Exception('...rendering error'),
                        );
              }

              return widget!;
            },
          ),
        ),
      ),
    );
  }
}
