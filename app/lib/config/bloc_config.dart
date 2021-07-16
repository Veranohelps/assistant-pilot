import 'package:app/logic/cubits/expeditions/expeditions_cubit.dart';
import 'package:app/logic/services/background_geolocation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class BlocAndProviderConfig extends StatelessWidget {
  const BlocAndProviderConfig({Key? key, this.child}) : super(key: key);

  final Widget? child;

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<BackgroundGeolocation>(
          lazy: false,
          create: (_) => BackgroundGeolocation(),
        ),
        BlocProvider(lazy: false, create: (_) => ExpeditionsCubit()..load()),
      ],
      child: child!,
    );
  }
}
