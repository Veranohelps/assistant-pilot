part of 'route_details.dart';

class CondicionesTab extends StatefulWidget {
  const CondicionesTab({Key? key}) : super(key: key);

  @override
  State<CondicionesTab> createState() => _CondicionesTabState();
}

class _CondicionesTabState extends State<CondicionesTab> {
  int selectedDayTabIndex = 0;
  int selectedRangeIndex = 0;

  @override
  Widget build(BuildContext context) {
    var selectedTime = context.watch<TimeFilterCubit>().state;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(height: 10),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              BrandRawLabel(
                isEmpty: selectedTime == null,
                isDisabled: false,
                isRequired: true,
                text: 'Fecha',
              ),
              Row(
                children: [
                  Expanded(
                    child: BrandFakeInput(
                      hasError: false,
                      intputText: selectedTime == null
                          ? 'no date'
                          : dateFormat2.format(selectedTime),
                      onPress: () => setDate(context),
                    ),
                  ),
                  SizedBox(width: 5),
                  IconButton(
                    onPressed: () => setDate(context),
                    icon: Icon(Icons.edit),
                  )
                ],
              ),
            ],
          ),
        ),
        Divider(height: 20),
        BlocProvider(
          create: (_) => WeatherCubit(
            context.read<RouteCubit>(),
            context.read<TimeFilterCubit>(),
          ),
          child: _WeatherBlock(),
        ),
      ],
    );
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

class _WeatherBlock extends StatefulWidget {
  const _WeatherBlock({Key? key}) : super(key: key);

  @override
  State<_WeatherBlock> createState() => _WeatherBlockState();
}

class _WeatherBlockState extends State<_WeatherBlock> {
  int selectedDayTabIndex = 0;

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<WeatherCubit, WeatherState>(
      builder: (context, weatherState) {
        if (weatherState is! WeatherLoaded) {
          return Center(child: Text('choose date and time'));
        }

        var days = weatherState.weather;

        var selectedDay = days[selectedDayTabIndex];
        var planningDay = context.read<TimeFilterCubit>().state!;

        var selectedTime = Duration(hours: planningDay.hour);

        return Column(
          children: [
            Container(
              height: 52,
              child: ListView(
                shrinkWrap: true,
                scrollDirection: Axis.horizontal,
                children: [
                  ...days
                      .asMap()
                      .map((k, v) => MapEntry(
                          k,
                          GestureDetector(
                            onTap: () =>
                                setState(() => selectedDayTabIndex = k),
                            child: Container(
                              width: 120,
                              alignment: Alignment.center,
                              margin: EdgeInsets.symmetric(horizontal: 5),
                              decoration: BoxDecoration(
                                border: Border(
                                  bottom: BorderSide(
                                    color: k == selectedDayTabIndex
                                        ? BrandColors.earthBlack
                                        : Colors.transparent,
                                    width: 2,
                                  ),
                                ),
                              ),
                              child: Column(
                                children: [
                                  Text(
                                    weekDay.format(v.dateTime).toUpperCase(),
                                    style: ThemeTypo.martaTab,
                                  ),
                                  Text(
                                    dataFormat1.format(v.dateTime),
                                    style: ThemeTypo.martaTab,
                                  ),
                                ],
                              ),
                            ),
                          )))
                      .values
                      .toList()
                ],
              ),
            ),
            Divider(height: 20),
            ...selectedDay.ranges
                .asMap()
                .map((key, range) {
                  var time = selectedDay.dateTime
                      .add(Duration(hours: 4 * key))
                      .add(selectedTime);

                  HourlyForecast data;

                  if (days.any((el) => isSameDate(el.dateTime, time))) {
                    data = days
                        .firstWhere((i) => isSameDate(i.dateTime, time))
                        .ranges[key]
                        .forecastHourly
                        .firstWhere((n) {
                      return n.dateTime == time;
                    });
                  } else {
                    data = days.last.ranges[key].forecastHourly.last;
                  }
                  return MapEntry(
                    key,
                    WeatherCard(
                      hourlyForecast: data,
                      time: time,
                      range: days.last.ranges[key].range,
                    ),
                  );
                })
                .values
                .toList()
          ],
        );
      },
    );
  }
}

class WeatherCard extends StatelessWidget {
  const WeatherCard({
    Key? key,
    required this.hourlyForecast,
    required this.time,
    required this.range,
  }) : super(key: key);

  final HourlyForecast hourlyForecast;
  final DateTime time;
  final List<int> range;

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                Icon(
                  DersuIcons.triangle,
                  size: 16,
                ),
                SizedBox(width: 12),
                Text(
                  '${range[1] == 0 ? range[1] : range[1] + 1} m',
                  style: MType.h6,
                ),
                SizedBox(width: 10),
                Text(
                  hhMMFormat.format(hourlyForecast.dateTime).toString(),
                  style: MType.subtitle1,
                ),
              ],
            ),
            SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                getColumnBlock(
                  'TEMPERATURA',
                  '${hourlyForecast.temperature} °C',
                ),
                getColumnBlock(
                  'Viento'.toUpperCase(),
                  '${hourlyForecast.windSpeed} km/h',
                ),
                getColumnBlock(
                  'precipitaciones'.toUpperCase(),
                  '${hourlyForecast.precipitation} %',
                )
              ],
            )
          ],
        ));
  }

  Widget getColumnBlock(String title, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: MType.overline.copyWith(
            color: BrandColors.martaDis,
          ),
        ),
        Text(
          value,
          style: MType.subtitle1.copyWith(
            color: BrandColors.marta87,
          ),
        )
      ],
    );
  }
}

bool isSameDate(DateTime date1, DateTime date2) {
  return DateTime(date1.toUtc().year, date1.toUtc().month, date1.toUtc().day) ==
      DateTime(date2.toUtc().year, date2.toUtc().month, date2.toUtc().day);
}
