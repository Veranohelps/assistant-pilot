import 'package:app/config/theme_typo.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:app/logic/cubits/dashboard/dashboard_cubit.dart';
import 'package:app/ui/components/brand_card/brand_card.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:app/ui/pages/expedition/expedition.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class Dashboard extends StatelessWidget {
  const Dashboard({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(LocaleKeys.dashboard_name.tr()),
      ),
      body: BlocBuilder<DashboardCubit, DashboardState>(
          builder: (context, state) {
        var isLoading = state is DashboardInitial || state is DashboardLoading;
        if (isLoading) {
          return BrandLoading();
        }

        var expeditions = (state as DashboardLoaded).upcomingExpeditions;
        var isEmpty = expeditions.isEmpty;
        return ListView.builder(
          itemCount: isEmpty ? 2 : expeditions.length + 1,
          padding: EdgeInsets.all(20),
          itemBuilder: (context, index) {
            if (index == 0) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 20.0),
                child: Text(
                  'Upcoming Expeditions',
                  style: ThemeTypo.h3,
                ),
              );
            }
            if (isEmpty) {
              return Padding(
                padding: const EdgeInsets.only(top: 10),
                child: Text('Empty'),
              );
            } else {
              var expedition = expeditions[index - 1];
              return GestureDetector(
                onTap: () => Navigator.of(context).push(
                  materialRoute(ExpeditionPage(expedition: expedition)),
                ),
                child: BrandCard(
                  child: Text(expedition.name),
                ),
              );
            }
          },
        );
      }),
    );
  }
}
