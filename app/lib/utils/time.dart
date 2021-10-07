String getGmtTimeZone() {
  var offset = DateTime.now().timeZoneOffset;
  var isNegative = offset.isNegative;
  var hours = offset.inHours.abs();
  var minutes = offset.inMinutes.abs() - hours * 60;
  var hoursString = addingLeadingZero(hours, 2);
  var minutesString = addingLeadingZero(minutes, 2);

  return 'GMT${isNegative ? '-' : '+'}$hoursString:$minutesString';
}

String addingLeadingZero(int number, didgetCount) {
  return number.toString().padLeft(didgetCount, '0');
}
