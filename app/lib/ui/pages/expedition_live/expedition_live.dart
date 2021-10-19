import 'package:app/config/brand_colors.dart';
import 'package:app/config/get_it_config.dart';
import 'package:app/logic/get_it/background_geolocation.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:provider/provider.dart';

import 'package:app/logic/cubits/live/live_cubit.dart';
import 'package:app/ui/components/maps/live_map.dart';
import 'package:flutter/material.dart';

class ExpeditionLive extends StatefulWidget {
  const ExpeditionLive({
    Key? key,
  }) : super(key: key);

  @override
  State<ExpeditionLive> createState() => _ExpeditionLiveState();
}

class _ExpeditionLiveState extends State<ExpeditionLive> {
  bool isReady = false;

  @override
  void initState() {
    initGeo();

    super.initState();
  }

  Future<void> initGeo() async {
    var backgroundGeolocation = getIt<BackgroundGeolocationService>();
    await backgroundGeolocation.requestPermissionTillAlways();
    setState(() {
      isReady = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    var state = context.read<LiveCubit>().state as LiveStateOn;

    return Scaffold(
      backgroundColor: BrandColors.black,
      body: SafeArea(
          bottom: false,
          child: isReady
              ? LiveMap(
                  route: state.expedition.routes[0], startTime: state.startTime)
              : BrandLoading()),
    );
  }
}
