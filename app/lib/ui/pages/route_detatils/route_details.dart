import 'package:app/config/theme_typo.dart';
import 'package:app/logic/cubits/dictionaries/dictionaries_cubit.dart';
import 'package:app/logic/cubits/route/route_cubit.dart';
import 'package:app/logic/cubits/time_filter/time_filter_cubit.dart';
import 'package:app/logic/models/route.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:app/ui/components/maps/static_map.dart';
import 'package:app/ui/pages/create_planning/create_planning.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:cubit_form/cubit_form.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:app/ui/components/brand_button/brand_button.dart' as buttons;

final dateFormat = DateFormat.yMMMd();
final dateFormat2 = DateFormat.yMMMMEEEEd().add_jm();

class RouteDetails extends StatelessWidget {
  const RouteDetails({
    Key? key,
    required this.route,
    this.isLife = false,
  }) : super(key: key);

  final DersuRouteShort route;
  final bool isLife;

  @override
  Widget build(BuildContext context) {
    var selectedTime = context.watch<TimeFilterCubit>().state;
    return Scaffold(
      appBar: AppBar(
        title: Text(route.name),
      ),
      body: BlocProvider(
        create: (_) => RouteCubit()..getRoute(route.url),
        child: Builder(
          builder: (context) {
            final dectionary = context.watch<DictionariesCubit>().state;
            final route = context.watch<RouteCubit>().state;

            if (route == null || dectionary is! DictionariesLoaded) {
              return BrandLoading();
            }
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
                  child: buttons.primaryShort(
                    onPressed: () => setDate(context),
                    label: 'time change',
                    text: selectedTime == null
                        ? 'no date'
                        : dateFormat2.format(selectedTime),
                  ),
                ),
                SizedBox(height: 15),
                Center(
                  child: buttons.primaryShort(
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
          },
        ),
      ),
    );
  }

  List<Widget> buildBlock(String title, String value) {
    return [
      Text(title, style: ThemeTypo.h4),
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
