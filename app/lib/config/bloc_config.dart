import 'package:app/logic/cubits/authentication/authentication_cubit.dart';
import 'package:app/logic/cubits/dictionaries/dictionaries_cubit.dart';

import 'package:app/logic/cubits/profile/profile_cubit.dart';
import 'package:app/logic/cubits/routes/expeditions_cubit.dart';
import 'package:app/logic/cubits/time_filter/time_filter_cubit.dart';
import 'package:app/logic/services/background_geolocation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class BlocAndProviderConfig extends StatelessWidget {
  const BlocAndProviderConfig({Key? key, this.child}) : super(key: key);

  final Widget? child;

  @override
  Widget build(BuildContext context) {
    var auth = AuthenticationCubit()..load();
    var dictionaries = DictionariesCubit(auth);
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<BackgroundGeolocation>(
            lazy: false, create: (_) => BackgroundGeolocation()),
        BlocProvider(lazy: false, create: (_) => auth),
        BlocProvider(lazy: false, create: (_) => RoutesCubit(auth)),
        BlocProvider(lazy: false, create: (_) => ProfileCubit(auth)),
        BlocProvider(lazy: false, create: (_) => dictionaries),
        BlocProvider(create: (_) => TimeFilterCubit()),
      ],
      child: child!,
    );
  }
}
