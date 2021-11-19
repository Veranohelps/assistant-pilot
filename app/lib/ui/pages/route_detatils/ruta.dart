// ignore_for_file: prefer_const_constructors

part of 'route_details.dart';

class RutaTab extends StatefulWidget {
  const RutaTab({Key? key}) : super(key: key);

  @override
  State<RutaTab> createState() => _RutaTabState();
}

class _RutaTabState extends State<RutaTab> {
  @override
  Widget build(BuildContext context) {
    final dectionary = context.watch<DictionariesCubit>().state;
    final route = context.watch<RouteCubit>().state;

    if (route == null || dectionary is! DictionariesLoaded) {
      return BrandLoader();
    }

    var selectedTime = context.watch<SelectTimeCubit>().state;
    var selectedActivityTypes = context.watch<SelectActivityTypesCubit>().state;

    var availableSelectedTypesIds =
        selectedActivityTypes.where((id) => route.activityTypeIds.contains(id));
    return ListView(
      children: [
        _buildMapBlock(route),
        BrandDivider(),
        _buildElevationBlock(route),
        SizedBox(height: 15),
        _routeDetails(context, route),
        _activityDetails(context, route),
        SizedBox(height: 20),
        Center(
          child: BrandButtons.primaryShort(
            onPressed: () => setTimeFilterDate(context),
            label: 'time change',
            text: selectedTime == null
                ? LocaleKeys.planning_route_details_no_date.tr()
                : dateFormat2.format(selectedTime),
          ),
        ),
        SizedBox(height: 15),
        if (availableSelectedTypesIds.isEmpty) ...[
          Text(
            LocaleKeys.planning_set_activity_reminder.tr(),
            textAlign: TextAlign.center,
          ),
        ],
        SizedBox(height: 30),
        Center(
          child: BrandButtons.primaryShort(
            onPressed: selectedTime == null || availableSelectedTypesIds.isEmpty
                ? null
                : () => Navigator.of(context).push(
                      materialRoute(
                        CreatePlanning(
                          startTime: selectedTime,
                          route: route,
                        ),
                      ),
                    ),
            text: LocaleKeys.planning_confirm_expedition.tr(),
          ),
        ),
        SizedBox(height: 30),
      ],
    );
  }

  Widget _buildMapBlock(DersuRouteFull route) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(height: 24),
          Text(route.name).h5,
          if (route.description != null) ...[
            SizedBox(height: 8),
            Text(route.description!).h6,
          ],
          SizedBox(height: 24),
          SizedBox(
            height: 400,
            child: StaticMap(
              route: route,
            ),
          ),
          SizedBox(height: 15),
        ],
      ),
    );
  }

  Widget _routeDetails(BuildContext context, DersuRouteFull route) {
    var dict = (context.read<DictionariesCubit>().state as DictionariesLoaded);

    var activityTypes =
        route.activityTypeIds.map((id) => dict.findActiveTypeById(id));

    var levelsTries = route.levelIds.map((id) => dict.levelTreeByLevelId(id));

    var notActivityLevels = levelsTries
        .where((tree) => !activityTypes.any((el) => el.skillId == tree[1].id));
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: notActivityLevels.map((l) {
        final compareSpan = compareWithUserLevel(context, l);

        return GestureDetector(
          onTap: () async {
            await Navigator.of(context).push(
              materialRoute(
                LevelsSetting(),
              ),
            );
            setState(() {});
          },
          child: Container(
            margin: EdgeInsets.fromLTRB(16, 0, 20, 0),
            decoration: BoxDecoration(
              border: Border(
                top: BorderSide(
                  color: BrandColors.black.withOpacity(0.2),
                ),
              ),
            ),
            padding: EdgeInsets.fromLTRB(0, 15, 0, 24),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Expanded(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      RichText(
                        text: TextSpan(
                          style: ThemeTypo.arimo14regular
                              .copyWith(color: BrandColors.black),
                          children: [
                            TextSpan(
                              text: l[0].name,
                            ),
                            TextSpan(
                              text: ' · ',
                            ),
                            compareSpan,
                          ],
                        ),
                      ),
                      RichText(
                        text: TextSpan(
                          style: ThemeTypo.arimo14regular
                              .copyWith(color: BrandColors.black),
                          children: [
                            TextSpan(
                              style: ThemeTypo.arimo18regular
                                  .copyWith(color: BrandColors.black),
                              text:
                                  '${l[2].name} · ${l[2].description.isEmpty ? 'no description' : l[2].description}',
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(Icons.arrow_forward, size: 30),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _activityDetails(BuildContext context, DersuRouteFull route) {
    var dict = (context.read<DictionariesCubit>().state as DictionariesLoaded);

    var activityTypes =
        route.activityTypeIds.map((id) => dict.findActiveTypeById(id));

    var levelsTries = route.levelIds.map((id) => dict.levelTreeByLevelId(id));

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        getSubtitle(LocaleKeys.planning_route_details_activities.tr()),
        ...activityTypes.map(
          (type) {
            var currentLevelTree = levelsTries
                .firstWhere((element) => element[1].id == type.skillId);
            return GestureDetector(
              onTap: () async {
                await Navigator.of(context).push(
                  materialRoute(
                    LevelsSetting(),
                  ),
                );
                setState(() {});
              },
              child: Container(
                margin: EdgeInsets.fromLTRB(16, 0, 20, 0),
                decoration: BoxDecoration(
                  border: Border(
                    bottom: BorderSide(
                      color: BrandColors.black.withOpacity(0.2),
                    ),
                  ),
                ),
                padding: EdgeInsets.fromLTRB(0, 15, 0, 24),
                child: Row(children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          currentLevelTree[1].name,
                          style: ThemeTypo.arimo18Semibold
                              .copyWith(color: BrandColors.black),
                        ),
                        RichText(
                          text: TextSpan(
                            style: ThemeTypo.arimo14regular
                                .copyWith(color: BrandColors.black),
                            children: [
                              TextSpan(text: '${currentLevelTree[0].name} · '),
                              compareWithUserLevel(context, currentLevelTree),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  Icon(Icons.arrow_forward, size: 30),
                ]),
              ),
            );
          },
        ).toList(),
      ],
    );
  }

  TextSpan compareWithUserLevel(
    BuildContext context,
    List<LevelsCatalogData> checkingLevelTree,
  ) {
    var dict = (context.read<DictionariesCubit>().state as DictionariesLoaded);

    var profileState = context.watch<ProfileCubit>().state;
    if (profileState is! ProfileReady ||
        profileState.profile is! FilledProfile) {
      return TextSpan(
        style: ThemeTypo.arimo14Semibold.copyWith(color: BrandColors.black),
        text: 'loading',
      );
    }
    var profileLevels = (profileState.profile as FilledProfile).currentLevels;

    var userLevelId = profileLevels[checkingLevelTree[1].id];
    if (userLevelId == null) {
      return TextSpan(
        style: ThemeTypo.arimo14Semibold.copyWith(color: BrandColors.black),
        text: 'Evaluación no realizada',
      );
    }
    var userLevelTree = dict.levelTreeByLevelId(userLevelId);

    var checkingLevel = (checkingLevelTree[2] as Level).level;
    var userLevel = (userLevelTree[2] as Level).level;

    if (checkingLevel == userLevel) {
      return TextSpan(
        style:
            ThemeTypo.arimo14Semibold.copyWith(color: BrandColors.martaBF961A),
        text: 'En tu nivel',
      );
    } else if (checkingLevel > userLevel) {
      return TextSpan(
        style: ThemeTypo.arimo14Semibold.copyWith(color: BrandColors.red),
        text: 'Nive por debajo',
      );
    } else {
      return TextSpan(
        style:
            ThemeTypo.arimo14Semibold.copyWith(color: BrandColors.marta2BA333),
        text: 'Nivel por encima',
      );
    }
  }

  Widget detailElement(String title, String value) {
    return SizedBox(
      width: 165,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title.toUpperCase()).overline.withColor(Colors.black38),
          Text(value).subtitle1,
        ],
      ),
    );
  }

  Widget getSubtitle(String text) {
    return Container(
      margin: EdgeInsets.only(left: 16),
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: BrandColors.survaceOverlay,
            width: 1,
          ),
        ),
      ),
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Text(text).h5,
    );
  }

  Widget _buildElevationBlock(DersuRouteFull route) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        getSubtitle(LocaleKeys.planning_route_details_elevation_profile.tr()),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            children: [
              SizedBox(height: 28),
              Container(
                height: 166,
                padding: EdgeInsets.symmetric(vertical: 30),
                decoration: BoxDecoration(
                  color: BrandColors.white,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: SizedBox(
                  height: 150,
                  width: double.infinity,
                  child: AltitudeChart(
                    route: route,
                  ),
                ),
              ),
              SizedBox(height: 28),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    detailElement(
                      LocaleKeys.planning_route_details_distance.tr(),
                      '${route.distanceInMetersToString} km',
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Flexible(
                      child: detailElement(
                        LocaleKeys.planning_route_details_elevation_gain.tr(),
                        '${route.elevationGainInMetersToString} m',
                      ),
                    ),
                    Flexible(
                      child: detailElement(
                        LocaleKeys.planning_route_details_elevation_loss.tr(),
                        '${route.elevationLossInMetersToString} m',
                      ),
                    ),
                  ],
                ),
              ),
              SizedBox(height: 8),
            ],
          ),
        ),
      ],
    );
  }
}
//LocaleKeys.planning_route_details_activities.tr()

