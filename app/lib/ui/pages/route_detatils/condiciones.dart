// ignore_for_file: prefer_const_constructors

part of 'route_details.dart';

class CondicionesTab extends StatefulWidget {
  const CondicionesTab({
    Key? key,
    required this.routeId,
  }) : super(key: key);

  final String routeId;

  @override
  State<CondicionesTab> createState() => _CondicionesTabState();
}

class _CondicionesTabState extends State<CondicionesTab> {
  int selectedDayTabIndex = 0;
  int selectedRangeIndex = 0;

  @override
  Widget build(BuildContext context) {
    var selectedTime = context.watch<SelectTimeCubit>().state;

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
                      onPress: () => setTimeFilterDate(context),
                    ),
                  ),
                  SizedBox(width: 5),
                  IconButton(
                    onPressed: () => setTimeFilterDate(context),
                    icon: Icon(Icons.edit),
                  )
                ],
              ),
            ],
          ),
        ),
        Divider(height: 20),
        Expanded(
          child: BlocProvider(
            create: (_) => WeatherCubit()..fetchWeather(widget.routeId),
            child: Builder(
              builder: (context) {
                if (context.watch<WeatherCubit>().state is! WeatherLoaded ||
                    context.watch<SelectTimeCubit>().state == null) {
                  return Center(child: Text('choose date and time'));
                }
                return _WeatherBlock();
              },
            ),
          ),
        ),
      ],
    );
  }
}

class _WeatherBlock extends StatefulWidget {
  const _WeatherBlock({Key? key}) : super(key: key);

  @override
  State<_WeatherBlock> createState() => _WeatherBlockState();
}

class _WeatherBlockState extends State<_WeatherBlock> {
  int selectedDayTabIndex = 0;

  final controller = ScrollController();
  late StreamSubscription subscirption;

  @override
  void initState() {
    WidgetsBinding.instance!.addPostFrameCallback(_afterLayout);
    super.initState();
  }

  void _afterLayout(_) {
    var a = context.read<SelectTimeCubit>();
    var b = context.read<WeatherCubit>();
    _checkTabs(a.state!, (b.state as WeatherLoaded).weather.days);

    subscirption = StreamGroup.merge([a.stream, b.stream]).listen(
      (_) => _checkTabs(a.state!, (b.state as WeatherLoaded).weather.days),
    );
  }

  @override
  void dispose() {
    controller.dispose();
    subscirption.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<WeatherCubit, WeatherState>(
      builder: (context, weatherState) {
        final weather = (weatherState as WeatherLoaded).weather;

        final selectedDay = weather.days[selectedDayTabIndex];
        final weatherInSelectedDay =
            weather.currentDayHorlyForecast(selectedDay);
        final planningDay = context.read<SelectTimeCubit>().state!;

        final weatherInStartingHour = weatherInSelectedDay
            .firstWhere((el) => el.dateTime.hour == planningDay.hour);

        return Column(
          children: [
            SizedBox(
              height: 52,
              child: ListView(
                shrinkWrap: true,
                scrollDirection: Axis.horizontal,
                controller: controller,
                children: [
                  ...weather.days
                      .asMap()
                      .map((k, day) => MapEntry(
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
                                    weekDay.format(day).toUpperCase(),
                                    style: ThemeTypo.martaTab,
                                  ),
                                  Text(
                                    dataFormat1.format(day),
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
            BrandDivider(
              margin: EdgeInsets.only(left: 16),
              height: 20,
            ),
            Row(
              children: [
                SizedBox(width: 16),
                Text(
                  'Metereología',
                  style: MType.h5,
                ),
                Spacer(),
                GestureDetector(
                  onTap: () {
                    Navigator.of(context).push(materialRoute(ImageViewer(
                      title: 'ver completa',
                      url: weather.meteograms[0].url,
                    )));
                  },
                  child: Padding(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 10),
                    child: Text('ver completa'.toUpperCase()),
                  ),
                ),
              ],
            ),
            BrandDivider(
              margin: EdgeInsets.only(left: 16),
            ),
            WeatherCard(
              rangeForecast: weatherInStartingHour.ranges[0],
              dateTime: weatherInStartingHour.dateTime,
            ),
          ],
        );
      },
    );
  }

  void _checkTabs(DateTime time, List<TimeWithTimeZone> days) {
    var hasThisDate = days.any(
      (el) => el.isSameDate(
        TimeWithTimeZone(
          el.timeZoneOffset,
          time.year,
          time.month,
          time.day,
        ),
      ),
    );
    if (hasThisDate) {
      var index = days.indexOf(
        TimeWithTimeZone(
          days[0].timeZoneOffset,
          time.year,
          time.month,
          time.day,
        ),
      );
      if (selectedDayTabIndex != index) {
        setState(() {
          selectedDayTabIndex = index;
          controller.animateTo(
            index * 120,
            duration: Duration(milliseconds: 300),
            curve: Curves.linear,
          );
        });
      }
    }
  }
}

class WeatherCard extends StatelessWidget {
  const WeatherCard({
    Key? key,
    required this.rangeForecast,
    required this.dateTime,
  }) : super(key: key);

  final RangeForecast rangeForecast;
  final TimeWithTimeZone dateTime;

  @override
  Widget build(BuildContext context) {
    final range = rangeForecast.range;

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
                  hhMMFormat.format(dateTime).toString(),
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
                  '${rangeForecast.temperature} °C',
                ),
                getColumnBlock(
                  'Viento'.toUpperCase(),
                  '${rangeForecast.windSpeed} km/h',
                ),
                getColumnBlock(
                  'precipitaciones'.toUpperCase(),
                  '${rangeForecast.precipitation} %',
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
