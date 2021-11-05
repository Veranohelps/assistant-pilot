// ignore_for_file: prefer_const_constructors

part of 'route_details.dart';

void setTimeFilterDate(BuildContext context) async {
  var today = DateTime.now();
  var tommorow = today.add(Duration(days: 1));

  var prevDate = context.read<SelectTimeCubit>().state;

  final initalDate = prevDate ?? tommorow;
  final initalTime = prevDate != null
      ? TimeOfDay.fromDateTime(prevDate)
      : TimeOfDay(hour: 8, minute: 0);

  var day = await showDatePicker(
    context: context,
    initialDate: initalDate,
    firstDate: tommorow,
    lastDate: today.add(Duration(days: 14)),
  );

  if (day != null) {
    final time = await showTimePicker(
      context: context,
      initialTime: initalTime,
    );

    if (time != null) {
      final dayTime =
          DateTime(day.year, day.month, day.day, time.hour, time.minute);
      context.read<SelectTimeCubit>().setNewTime(dayTime);
    }
  }
}
