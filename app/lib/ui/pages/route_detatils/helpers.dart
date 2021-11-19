part of 'route_details.dart';

void setTimeFilterDate(BuildContext context) async {
  var today = DateTime.now();
  var tommorow = today.add(Duration(days: 1));

  var prevDate = context.read<SelectTimeCubit>().state;

  final initalDate = prevDate ?? tommorow;

  var day = await showDatePicker(
    context: context,
    initialDate: initalDate,
    firstDate: today.hour < 23 ? today : tommorow,
    lastDate: today.add(Duration(days: 13)),
  );

  if (day != null) {
    TimeOfDay? time;
    final initalTime = prevDate != null
        ? TimeOfDay.fromDateTime(prevDate)
        : day.isSameDate(today)
            ? TimeOfDay(hour: today.hour + 1, minute: today.minute)
            : TimeOfDay(hour: 8, minute: 0);

    time = await showCustomTimePicker(
        context: context,
        onFailValidation: (context) => print('Must be in future'),
        initialTime: initalTime,
        selectableTimePredicate: (time) {
          if (day.isSameDate(today)) {
            return today.add(Duration(minutes: 30)).isBefore(DateTime(
                  today.year,
                  today.month,
                  today.day,
                  time!.hour,
                  time.minute,
                ));
          } else {
            return true;
          }
        });

    if (time != null) {
      final dayTime =
          DateTime(day.year, day.month, day.day, time.hour, time.minute);
      context.read<SelectTimeCubit>().setNewTime(dayTime);
    }
  }
}
