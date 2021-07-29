import 'package:app/app.dart';
import 'package:app/ui/pages/error/error.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'config/bloc_config.dart';
import 'config/brand_theme.dart';
import 'config/get_it_config.dart';
import 'config/hive_config.dart';

var apiDefaultLog = false;

Future main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await dotenv.load(fileName: "develop-public.env");
  await getItSetup();
  await HiveConfig.init();
  await initHydratedBloc();
  runApp(_Main());
}

class _Main extends StatelessWidget {
  const _Main({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocAndProviderConfig(
      child: MaterialApp(
        navigatorKey: getIt.get<NavigationService>().navigatorKey,
        debugShowCheckedModeBanner: false,
        theme: brandTheme,
        title: 'Dersu Assistant App',
        home: App(),
        builder: (BuildContext context, Widget? widget) {
          ErrorWidget.builder =
              (FlutterErrorDetails errorDetails) => ErrorScreen(
                    error: Exception('...rendering error'),
                  );
          return widget!;
        },
      ),
    );
  }
}
