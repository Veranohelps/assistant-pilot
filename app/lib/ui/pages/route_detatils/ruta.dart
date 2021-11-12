// ignore_for_file: prefer_const_constructors

part of 'route_details.dart';

class RutaTab extends StatelessWidget {
  const RutaTab({Key? key}) : super(key: key);

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
      padding: EdgeInsets.all(16),
      children: [
        SizedBox(
          height: 400,
          child: StaticMap(
            route: route,
          ),
        ),
        SizedBox(height: 15),
        SizedBox(
          height: 150,
          child: AltitudeChart(
            route: route,
          ),
        ),
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

  Widget _routeDetails(BuildContext context, DersuRouteFull route) {
    var dict = (context.read<DictionariesCubit>().state as DictionariesLoaded);

    var activityTypes =
        route.activityTypeIds.map((id) => dict.findActiveTypeById(id));

    var levelsTries = route.levelIds.map((id) => dict.levelTreeByLevelId(id));

    var notActivityLevels = levelsTries
        .where((tree) => !activityTypes.any((el) => el.skillId == tree[1].id));

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              detailElement(
                  'distancia', '${route.distanceInMetersToString} km'),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              detailElement('Desnivel positivo',
                  '${route.elevationGainInMetersToString} m'),
              detailElement('Desnivel negativo',
                  '${route.elevationLossInMetersToString} m'),
            ],
          ),
        ),
        if (notActivityLevels.isNotEmpty)
          Padding(
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: notActivityLevels
                    .take(2)
                    .map(
                      (l) => detailElement(l[1].name, l[2].name),
                    )
                    .toList(),
              ))
      ],
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
        Text('Actividades').h5,
        BrandDivider(height: 23),
        ...activityTypes.map(
          (type) {
            var currentLevelTree = levelsTries
                .firstWhere((element) => element[1].id == type.skillId);
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  type.name,
                  style: ThemeTypo.martaActivityTitle,
                ),
                Text(
                  'Nivel ${currentLevelTree[2].name}',
                  style: ThemeTypo.martaLevelValue,
                ),
              ],
            );
          },
        ).toList(),
      ],
    );
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
}
