import 'package:app/logic/cubits/authentication/authentication_cubit.dart';
import 'package:app/logic/cubits/dictionaries/dictionaries_cubit.dart';
import 'package:app/logic/cubits/expeditions/expeditions_cubit.dart';
import 'package:app/logic/cubits/live/live_cubit.dart';
import 'package:app/logic/cubits/profile/profile_cubit.dart';
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
        BlocProvider(lazy: false, create: (_) => ExpeditionsCubit(auth)),
        BlocProvider(lazy: false, create: (_) => LiveCubit()),
        BlocProvider(lazy: false, create: (_) => ProfileCubit(auth)),
        BlocProvider(lazy: false, create: (_) => dictionaries),
      ],
      child: child!,
    );
  }
}
