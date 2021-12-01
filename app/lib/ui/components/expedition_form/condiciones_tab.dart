// ignore_for_file: prefer_const_constructors

part of 'expedition_form.dart';

class CondicionesTab extends StatefulWidget {
  const CondicionesTab({
    Key? key,
    required this.routeId,
    required this.formCubit,
    required this.isEditable,
  }) : super(key: key);

  final String routeId;
  final ExpeditionFormCubit formCubit;
  final bool isEditable;
  @override
  State<CondicionesTab> createState() => _CondicionesTabState();
}

class _CondicionesTabState extends State<CondicionesTab> {
  int selectedDayTabIndex = 0;
  int selectedRangeIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(height: 10),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: widget.isEditable
              ? _SimpleDatePicker(
                  date: widget.formCubit.date,
                  formCubit: widget.formCubit,
                )
              : Text(dateFormat2.format(widget.formCubit.date.state.value!)),
        ),
        if (widget.isEditable) Divider(height: 20),
        Expanded(
          child: BlocBuilder<FieldCubit<DateTime?>, FieldCubitState<DateTime?>>(
            bloc: widget.formCubit.date,
            builder: (context, date) {
              if (context.watch<WeatherCubit>().state is! WeatherLoaded ||
                  date.value == null) {
                return Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Text(
                      LocaleKeys.planning_conditions_select_explanation.tr()),
                );
              }
              return _WeatherBlock(
                  formCubit: widget.formCubit, isEditable: widget.isEditable);
            },
          ),
        ),
      ],
    );
  }
}

class _WeatherBlock extends StatefulWidget {
  const _WeatherBlock({
    Key? key,
    required this.formCubit,
    required this.isEditable,
  }) : super(key: key);
  final ExpeditionFormCubit formCubit;
  final bool isEditable;
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
    var a = widget.formCubit.date;
    var b = context.read<WeatherCubit>();

    _checkTabs(a.state.value!, (b.state as WeatherLoaded).weather.days);

    subscirption = StreamGroup.merge([a.stream, b.stream]).listen(
      (_) =>
          _checkTabs(a.state.value!, (b.state as WeatherLoaded).weather.days),
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
        final planningDay = widget.formCubit.date.state.value!;

        final amountOfRanges = weather.forecastHourly.first.ranges.length;
        final List<HourlyForecast> hourlyForecastList = [];
        final startingTimeWithTimeZone = TimeWithTimeZone(
          Duration(minutes: weather.metadata.timezoneUTCOffsetInMinutes),
          selectedDay.year,
          selectedDay.month,
          selectedDay.day,
          planningDay.hour,
        );
        for (var i = 0; i < amountOfRanges; i++) {
          var forecast = weather.forecastHourly.firstWhere((f) =>
              f.dateTime ==
              startingTimeWithTimeZone.add(Duration(hours: 4 * i)));
          hourlyForecastList.add(forecast);
        }

        return ListView(
          children: [
            if (widget.isEditable)
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
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 16,
                vertical: 10,
              ),
              child: Text(
                'Metereología',
                style: MType.h5,
              ),
            ),
            BrandDivider(
              margin: EdgeInsets.only(left: 16),
            ),
            ...hourlyForecastList
                .asMap()
                .map((k, f) => MapEntry(
                      k,
                      WeatherCard(
                          rangeForecast: f.ranges[k],
                          dateTime: f.dateTime,
                          meteogram: weather.meteograms[k]),
                    ))
                .values
                .toList(),
          ],
        );
      },
    );
  }

  void _checkTabs(DateTime time, List<TimeWithTimeZone> days) {
    if (widget.isEditable) {
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
            controller.jumpTo(index * 120);
          });
        }
      }
    }
  }
}

class WeatherCard extends StatelessWidget {
  const WeatherCard({
    Key? key,
    required this.rangeForecast,
    required this.dateTime,
    required this.meteogram,
  }) : super(key: key);

  final RangeForecast rangeForecast;
  final TimeWithTimeZone dateTime;
  final Meteogram meteogram;

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
                Spacer(),
                GestureDetector(
                  onTap: () {
                    Navigator.of(context).push(materialRoute(ImageViewer(
                      title: 'Meteogram',
                      url: meteogram.url,
                    )));
                  },
                  child: Text(
                    'meteogram',
                    style: MType.subtitle1.copyWith(
                      decoration: TextDecoration.underline,
                    ),
                  ),
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
                  '${rangeForecast.precipitationProbability} %',
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
