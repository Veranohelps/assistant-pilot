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

    var selectedTime = context.watch<TimeFilterCubit>().state;

    return ListView(
      padding: EdgeInsets.all(10),
      children: [
        ...buildBlock('Name', route.name),
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
                ? 'no date'
                : dateFormat2.format(selectedTime),
          ),
        ),
        SizedBox(height: 15),
        Center(
          child: BrandButtons.primaryShort(
            onPressed: selectedTime == null
                ? null
                : () => Navigator.of(context).push(
                      materialRoute(
                        CreatePlanning(
                          startTime: selectedTime,
                          routeId: route.id,
                        ),
                      ),
                    ),
            text: 'Confirm expedition',
          ),
        ),
      ],
    );
  }

  List<Widget> buildBlock(String title, String value) {
    return [
      Text(title, style: ThemeTypo.p0),
      SizedBox(height: 5),
      Text(value, style: ThemeTypo.p0),
      SizedBox(height: 10),
    ];
  }
}
