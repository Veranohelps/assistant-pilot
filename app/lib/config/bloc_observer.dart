import 'package:flutter_bloc/flutter_bloc.dart';

class SimpleBlocObserver extends BlocObserver {
  void onError(BlocBase cubit, Object error, StackTrace stackTrace) {
    super.onError(cubit, error, stackTrace);
  }

  void onEvent(Bloc bloc, Object? event) {
    super.onEvent(bloc, event);
  }
}
