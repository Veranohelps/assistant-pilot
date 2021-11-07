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
      padding: EdgeInsets.all(10),
      children: [
        SizedBox(
          height: 400,
          child: StaticMap(
            route: route,
          ),
        ),
        SizedBox(height: 15),
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
          SizedBox(height: 20)
        ],
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
      ],
    );
  }
}
