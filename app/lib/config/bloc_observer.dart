import 'package:app/config/get_it_config.dart';
import 'package:app/ui/pages/error/error.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class SimpleBlocObserver extends BlocObserver {
  @override
  void onError(BlocBase cubit, Object error, StackTrace stackTrace) {
    var navigator = getIt.get<NavigationService>().navigator;
    navigator.push(
      materialRoute(
        ErrorScreen(
          error: error,
          stackTrace: stackTrace,
        ),
      ),
    );
    super.onError(cubit, error, stackTrace);
  }
}
