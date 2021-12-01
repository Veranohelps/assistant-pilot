import 'package:app/config/theme_typo.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:app/logic/cubits/expeditions/expeditions_cubit.dart';
import 'package:app/logic/cubits/profile/profile_cubit.dart';
import 'package:app/logic/forms/expedition_form/expedition_form.dart';
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
      body: BlocBuilder<ExpeditionsCubit, ExpeditionsState>(
          builder: (context, state) {
        var isLoading =
            state is ExpeditionsInitial || state is ExpeditionsLoading;
        if (isLoading) {
          return BrandLoader();
        }

        var upcomingExpeditions =
            (state as DashboardLoaded).upcomingExpeditions;

        var pendingExpeditionInvite = state.pendingExpeditionInvite;

        return Padding(
          padding: const EdgeInsets.all(20),
          child: CustomScrollView(
            slivers: [
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 20.0),
                  child: Text(
                    LocaleKeys.dashboard_upcoming_expeditions.tr(),
                    style: ThemeTypo.h2,
                  ),
                ),
              ),
              upcomingExpeditions.isEmpty
                  ? SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.only(bottom: 10.0, top: 30),
                        child: Text(LocaleKeys
                            .dashboard_upcoming_expeditions_empty
                            .tr()),
                      ),
                    )
                  : SliverList(
                      delegate: SliverChildListDelegate(
                        upcomingExpeditions
                            .map((e) => GestureDetector(
                                  onTap: () => Navigator.of(context).push(
                                    noAnimationRoute(ExpeditionPage(
                                        expedition: e,
                                        mode: e.userId ==
                                                (context
                                                        .read<ProfileCubit>()
                                                        .state as ProfileReady)
                                                    .profile
                                                    .id
                                            ? ExpeditionFormMode.ownerShow
                                            : ExpeditionFormMode
                                                .confirmedGuest)),
                                  ),
                                  child: BrandCard(
                                    child: Text(e.name),
                                  ),
                                ))
                            .toList(),
                      ),
                    ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 10.0, top: 30),
                  child: Text(
                    LocaleKeys.dashboard_pending_invitations.tr(),
                    style: ThemeTypo.h2,
                  ),
                ),
              ),
              pendingExpeditionInvite.isEmpty
                  ? SliverToBoxAdapter(
                      child: Padding(
                        padding: const EdgeInsets.only(top: 10),
                        child: Text(
                            LocaleKeys.dashboard_no_pending_invitations.tr()),
                      ),
                    )
                  : SliverList(
                      delegate: SliverChildListDelegate(
                        pendingExpeditionInvite
                            .map((e) => GestureDetector(
                                  onTap: () => Navigator.of(context)
                                      .push(noAnimationRoute(ExpeditionPage(
                                    expedition: e,
                                    mode: ExpeditionFormMode.invitedGuest,
                                  ))),
                                  child: BrandCard(
                                    child: Text(e.name),
                                  ),
                                ))
                            .toList(),
                      ),
                    )
            ],
          ),
        );
      }),
    );
  }
}
