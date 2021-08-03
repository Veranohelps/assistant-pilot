import 'package:app/ui/pages/expedition_details/expedition_details.dart';
import 'package:app/ui/pages/rootRoute.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive/hive.dart';

import 'config/geofence.dart';
import 'config/hive_config.dart';
import 'logic/cubits/live/live_cubit.dart';
import 'ui/components/expedition/expedition.dart';

class App extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => _AppState();
}

class _AppState extends State<App> {
  @override
  void initState() {
    WidgetsBinding.instance!.addPostFrameCallback(_afterLayout);
    super.initState();
  }

  Future<void> _afterLayout(_) async {
    var liveCubitState = context.read<LiveCubit>().state;

    if (liveCubitState is IsLive) {
      Navigator.of(context)
        ..push(
          materialRoute(
            ExpeditionDetails(
              isLife: true,
              expedition: liveCubitState.expedition,
            ),
          ),
        )
        ..push(
          materialRoute(
            ExpeditionMapWidget(
                isLive: true,
                expedition: liveCubitState.expedition,
                route: liveCubitState.route,
                waypointPrecision: Hive.box(HiveContants.geoConfig.txt).get(
                  HiveContants.waypointPrecision.txt,
                  defaultValue: kWaypointPrecisionDefault,
                )),
          ),
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return RootPage();
  }
}
