import 'package:app/config/brand_colors.dart';
import 'package:provider/provider.dart';

import 'package:app/logic/cubits/live/live_cubit.dart';
import 'package:app/ui/components/maps/live_map.dart';
import 'package:flutter/material.dart';

class ExpeditionLive extends StatelessWidget {
  const ExpeditionLive({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var state = context.read<LiveCubit>().state as LiveStateOn;

    return Scaffold(
      backgroundColor: BrandColors.black,
      body: SafeArea(
        bottom: false,
        child: LiveMap(
          route: state.expedition.routes[0],
          expeditionId: state.expedition.id,
          startTime: state.startTime,
        ),
      ),
    );
  }
}
