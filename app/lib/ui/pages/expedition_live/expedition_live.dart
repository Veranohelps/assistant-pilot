import 'package:app/config/brand_colors.dart';
import 'package:app/logic/cubits/dictionaries/dictionaries_cubit.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:provider/provider.dart';

import 'package:app/logic/cubits/live/live_cubit.dart';
import 'package:app/ui/pages/expedition_live/live_map.dart';
import 'package:flutter/material.dart';

class ExpeditionLive extends StatelessWidget {
  const ExpeditionLive({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var state = context.read<LiveCubit>().state as LiveStateOn;
    var dictionary = context.watch<DictionariesCubit>().state;
    if (dictionary is! DictionariesLoaded) {
      return BrandLoader();
    }
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
