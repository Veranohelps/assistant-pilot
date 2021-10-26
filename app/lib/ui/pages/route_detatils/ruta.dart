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
            onPressed: () => setDate(context),
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

  void setDate(BuildContext context) async {
    var today = DateTime.now();
    var tommorow = today.add(Duration(days: 1));
    var day = await showDatePicker(
      context: context,
      initialDate: tommorow,
      firstDate: tommorow,
      lastDate: today.add(Duration(days: 31)),
    );

    if (day != null) {
      final time = await showTimePicker(
        context: context,
        initialTime: TimeOfDay(hour: 8, minute: 0),
      );

      if (time != null) {
        final dayTime =
            DateTime(day.year, day.month, day.day, time.hour, time.minute);
        context.read<TimeFilterCubit>().setNewTime(dayTime);
      }
    }
  }
}
