part of 'expedition_form.dart';

void setTimeFilterDate(
    BuildContext context, ExpeditionFormCubit formCubit) async {
  final timezoneOffset = formCubit.route.state.value!.timezone.offset;

  var fakeToday = TimeWithTimeZone.fromLocal(
    DateTime.now(),
    timezoneOffset,
  ).toFakeLocal();
  var tommorow = fakeToday.add(Duration(days: 1));

  var dateField = formCubit.date;
  var prevDate = formCubit.date.state.value;
  final initalDate = prevDate?.toFakeLocal() ?? tommorow;

  var day = await showDatePicker(
    context: context,
    initialDate: initalDate,
    firstDate: fakeToday.hour < 23 ? fakeToday : tommorow,
    lastDate: fakeToday.add(Duration(days: 13)),
  );

  if (day != null) {
    TimeOfDay? time;
    final initalTime = prevDate != null
        ? TimeOfDay.fromDateTime(prevDate.toFakeLocal())
        : day.isSameDate(fakeToday)
            ? TimeOfDay(hour: fakeToday.hour + 1, minute: fakeToday.minute)
            : TimeOfDay(hour: 8, minute: 0);

    time = await showCustomTimePicker(
      context: context,
      onFailValidation: (context) => print('Must be in future'),
      initialTime: initalTime,
      selectableTimePredicate: (time) {
        if (day.isSameDate(fakeToday)) {
          return fakeToday.add(Duration(minutes: 30)).isBefore(DateTime(
                fakeToday.year,
                fakeToday.month,
                fakeToday.day,
                time!.hour,
                time.minute,
              ));
        } else {
          return true;
        }
      },
    );

    if (time != null) {
      final dayTime =
          DateTime(day.year, day.month, day.day, time.hour, time.minute);
      dateField.setValue(
        TimeWithTimeZone.fromFakeLocal(
          dayTime,
          timezoneOffset,
        ),
      );
    }
  }
}
