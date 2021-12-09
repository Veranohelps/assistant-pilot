part of 'expedition_form.dart';

void setTimeFilterDate(
    BuildContext context, ExpeditionFormCubit formCubit) async {
  final timezoneOffset = formCubit.route.state.value!.timezone.offset;

  var fakeToday = TimeWithTimeZone.fromLocal(
    DateTime.now(),
    timezoneOffset,
  ).toFakeLocal();
  final dateField = formCubit.date;
  final minimalDate = fakeToday.add(Duration(hours: 1));
  final prevDate = formCubit.date.state.value!.toFakeLocal();

  final initDate = prevDate.isBefore(minimalDate)
      ? minimalDate.add(Duration(days: 1))
      : prevDate;

  var day = await showDatePicker(
    context: context,
    initialDate: initDate,
    firstDate: minimalDate,
    lastDate: fakeToday.add(Duration(days: 13)),
  );

  if (day != null) {
    TimeOfDay? time, initalTime;

    var checkingDate = TimeWithTimeZone(
      timezoneOffset,
      day.year,
      day.month,
      day.day,
      initDate.hour,
      initDate.minute,
    ).toFakeLocal();

    if (minimalDate.isBefore(checkingDate)) {
      initalTime = TimeOfDay.fromDateTime(initDate);
    } else {
      // the inital date time is not valid, that's why we are chaing it to minimal time.
      initalTime = TimeOfDay.fromDateTime(minimalDate);
    }

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
