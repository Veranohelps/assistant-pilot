import 'package:app/config/brand_colors.dart';
import 'package:app/config/brand_theme.dart';
import 'package:app/config/theme_typo.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:app/logic/cubits/dictionaries/dictionaries_cubit.dart';
import 'package:app/logic/cubits/expeditions/expeditions_cubit.dart';
import 'package:app/logic/cubits/routes/expeditions_cubit.dart';
import 'package:app/logic/forms/expedition_form/expedition_form.dart';
import 'package:app/logic/models/route.dart';
import 'package:app/ui/components/brand_icons/dersu_icons_icons.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:flutter/material.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:app/ui/pages/route_detatils/route_details.dart';

class RoutesTab extends StatefulWidget {
  const RoutesTab({
    Key? key,
  }) : super(key: key);
  @override
  State<RoutesTab> createState() => _RoutesTabState();
}

class _RoutesTabState extends State<RoutesTab> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance!.addPostFrameCallback(_afterLayout);
  }

  void _afterLayout(_) {
    context.read<RoutesCubit>().load();
  }

  @override
  Widget build(BuildContext context) {
    var routesState = context.watch<RoutesCubit>().state;

    if (routesState is! RoutesLoaded) {
      return BrandLoader();
    }

    return BlocProvider(
      create: (_) => ExpeditionFormCubit(
        initType: ExpeditionFormMode.ownerPlanning,
        expeditionsCubit: context.read<ExpeditionsCubit>()
      ),
      child: Builder(builder: (context) {
        return Scaffold(
          appBar: AppBar(title: Text(LocaleKeys.planning_name.tr())),
          body: ListView(
            padding: paddingH25V0.copyWith(top: 20),
            children: [
              for (var route in routesState.list)
                GestureDetector(
                  onTap: () {
                    Navigator.of(context).push(
                      noAnimationRoute(
                        RouteDetails(
                          route: route,
                          formCubit: context.read<ExpeditionFormCubit>(),
                        ),
                        route.name,
                      ),
                    );
                  },
                  child: RouteCard(route: route),
                ),
            ],
          ),
        );
      }),
    );
  }
}

class RouteCard extends StatelessWidget {
  const RouteCard({
    Key? key,
    required this.route,
  }) : super(key: key);

  final DersuRouteShort route;
  @override
  Widget build(BuildContext context) {
    var dict = (context.read<DictionariesCubit>().state as DictionariesLoaded);

    var levels =
        route.levelIds.map((id) => dict.levelTreeByLevelId(id)).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.vertical(top: Radius.circular(8)),
            color: BrandColors.white,
          ),
          child: Icon(
            DersuIcons.logo,
            color: BrandColors.mintGreen,
            size: 40,
          ),
          height: 145,
        ),
        Container(
          margin: EdgeInsets.only(bottom: 16),
          padding: EdgeInsets.fromLTRB(16, 24, 8, 16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.vertical(bottom: Radius.circular(8)),
            color: BrandColors.white,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(route.name).h6,
              SizedBox(height: 12),
              Text(
                '${route.distanceInMetersToString} km | ▲${route.elevationGainInMetersToString} m | ▼${route.elevationLossInMetersToString} m ',
              ).subtitle1,
              SizedBox(height: 8),
              Text(
                levels
                    .map(
                      (tree) => '${tree[1].name}: ${tree[2].name}',
                    )
                    .toList()
                    .join(', '),
                style: ThemeTypo.subtitle1,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
