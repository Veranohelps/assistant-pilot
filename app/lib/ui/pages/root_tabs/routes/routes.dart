import 'package:app/config/brand_theme.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:app/logic/cubits/routes/expeditions_cubit.dart';
import 'package:app/ui/components/brand_card/brand_card.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:app/ui/pages/route_detatils/route_details.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:flutter/material.dart';
import 'package:app/utils/extensions/text_extension.dart';
import 'package:easy_localization/easy_localization.dart';

class RoutesTab extends StatefulWidget {
  const RoutesTab({Key? key}) : super(key: key);

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
      return BrandLoading();
    }
    return Scaffold(
      appBar: AppBar(title: Text(LocaleKeys.planning_name.tr())),
      body: ListView(
        padding: paddingH25V0.copyWith(top: 20),
        children: [
          Text(LocaleKeys.planning_name.tr()),
          for (var route in routesState.list)
            GestureDetector(
              onTap: () {
                Navigator.of(context).push(
                  materialRoute(
                    RouteDetails(
                      route: route,
                    ),
                    route.name,
                  ),
                );
              },
              child: BrandCard(
                child: Text(route.name).h3,
              ),
            ),
        ],
      ),
    );
  }
}
