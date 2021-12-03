class TimeWithTimeZone implements DateTime {
  static const int maxMillisecondsSinceEpoch = 8640000000000000;

  static const int minMillisecondsSinceEpoch = -maxMillisecondsSinceEpoch;

  /// Date time with time zone
  final DateTime _localDateTime;

  /// UTC
  final DateTime _native;

  bool isSameDate(TimeWithTimeZone other) {
    return year == other.year && month == other.month && day == other.day;
  }

  @override
  int get millisecondsSinceEpoch => _native.millisecondsSinceEpoch;

  @override
  int get microsecondsSinceEpoch => _native.microsecondsSinceEpoch;

  final Duration offset;

  @override
  bool get isUtc => offset == Duration.zero;

  bool get isLocal => offset == DateTime.now().timeZoneOffset;

  static parse(String formattedString) {
    var re = _parseFormat;
    Match? match = re.firstMatch(formattedString);
    if (match != null) {
      int parseIntOrZero(String? matched) {
        if (matched == null) return 0;
        return int.parse(matched);
      }

      // Parses fractional second digits of '.(\d+)' into the combined
      // microseconds. We only use the first 6 digits because of DateTime
      // precision of 999 milliseconds and 999 microseconds.
      int parseMilliAndMicroseconds(String? matched) {
        if (matched == null) return 0;
        final length = matched.length;
        assert(length >= 1);
        var result = 0;
        for (var i = 0; i < 6; i++) {
          result *= 10;
          if (i < matched.length) {
            result += matched.codeUnitAt(i) ^ 0x30;
          }
        }
        return result;
      }

      final years = int.parse(match[1]!);
      final month = int.parse(match[2]!);
      final day = int.parse(match[3]!);
      final hour = parseIntOrZero(match[4]);
      final minute = parseIntOrZero(match[5]);
      final second = parseIntOrZero(match[6]);
      final milliAndMicroseconds = parseMilliAndMicroseconds(match[7]);
      final millisecond =
          milliAndMicroseconds ~/ Duration.microsecondsPerMillisecond;
      final microsecond =
          milliAndMicroseconds.remainder(Duration.microsecondsPerMillisecond);

      final tzSign = match[9];
      final sign = (tzSign == '-') ? -1 : 1;
      final hourDifference = int.parse(match[10]!);
      final minuteDifference = parseIntOrZero(match[11]);

      var offset =
          Duration(hours: hourDifference, minutes: minuteDifference) * sign;

      return TimeWithTimeZone(
        offset,
        years,
        month,
        day,
        hour,
        minute,
        second,
        millisecond,
        microsecond,
      );
    } else {
      throw FormatException("Invalid date format", formattedString);
    }
  }

  TimeWithTimeZone(Duration offset, int year,
      [int month = 1,
      int day = 1,
      int hour = 0,
      int minute = 0,
      int second = 0,
      int millisecond = 0,
      int microsecond = 0])
      : this._(
            _utcFromLocalDateTime(
                DateTime.utc(year, month, day, hour, minute, second,
                    millisecond, microsecond),
                offset),
            offset);

  TimeWithTimeZone._(
    DateTime native,
    this.offset,
  )   : _native = native,
        _localDateTime = native.add(offset);

  static DateTime _utcFromLocalDateTime(DateTime local, Duration offset) {
    var unix = local.millisecondsSinceEpoch - offset.inMilliseconds;

    // Ensure original microseconds are preserved regardless of TZ shift.
    final microsecondsSinceEpoch =
        Duration(milliseconds: unix, microseconds: local.microsecond)
            .inMicroseconds;
    return DateTime.fromMicrosecondsSinceEpoch(microsecondsSinceEpoch,
        isUtc: true);
  }

  @override
  DateTime toUtc() =>
      DateTime.fromMicrosecondsSinceEpoch(microsecondsSinceEpoch, isUtc: true);

  @override
  DateTime toLocal() =>
      DateTime.fromMicrosecondsSinceEpoch(microsecondsSinceEpoch, isUtc: false);

  static String _fourDigits(int n) {
    var absN = n.abs();
    var sign = n < 0 ? "-" : "";
    if (absN >= 1000) return "$n";
    if (absN >= 100) return "${sign}0$absN";
    if (absN >= 10) return "${sign}00$absN";
    return "${sign}000$absN";
  }

  static String _threeDigits(int n) {
    if (n >= 100) return "$n";
    if (n >= 10) return "0$n";
    return "00$n";
  }

  static String _twoDigits(int n) {
    if (n >= 10) return "$n";
    return "0$n";
  }

  @override
  String toString() => _toString(iso8601: false);

  @override
  String toIso8601String() => _toString(iso8601: true);

  String _toString({bool iso8601 = true}) {
    var y = _fourDigits(year);
    var m = _twoDigits(month);
    var d = _twoDigits(day);
    var sep = iso8601 ? "T" : " ";
    var h = _twoDigits(hour);
    var min = _twoDigits(minute);
    var sec = _twoDigits(second);
    var ms = _threeDigits(millisecond);
    var us = microsecond == 0 ? "" : _threeDigits(microsecond);

    if (isUtc) {
      return "$y-$m-$d$sep$h:$min:$sec.$ms${us}Z";
    } else {
      var offSign = offset >= Duration.zero ? '+' : '';

      var offH = offset.inHours.toString();
      var offM =
          _twoDigits(offset.inMinutes.remainder(60)).toString().padLeft(2, "0");

      return "$y-$m-$d$sep$h:$min:$sec.$ms$us$offSign$offH:$offM";
    }
  }

  @override
  TimeWithTimeZone add(Duration duration) =>
      TimeWithTimeZone._(_native.add(duration), offset);

  @override
  TimeWithTimeZone subtract(Duration duration) =>
      TimeWithTimeZone._(_native.subtract(duration), offset);

  @override
  Duration difference(DateTime other) => _native.difference(other);

  @override
  bool operator ==(dynamic other) {
    return identical(this, other) ||
        other is TimeWithTimeZone &&
            _native.isAtSameMomentAs(other._native) &&
            offset == other.offset;
  }

  @override
  bool isBefore(DateTime other) => _native.isBefore(other);

  @override
  bool isAfter(DateTime other) => _native.isAfter(other);

  @override
  bool isAtSameMomentAs(DateTime other) => _native.isAtSameMomentAs(other);

  @override
  int compareTo(DateTime other) => _native.compareTo(other);

  @override
  int get hashCode => _native.hashCode;

  @override
  Duration get timeZoneOffset => offset;

  @override
  int get year => _localDateTime.year;

  @override
  int get month => _localDateTime.month;

  @override
  int get day => _localDateTime.day;

  @override
  int get hour => _localDateTime.hour;

  @override
  int get minute => _localDateTime.minute;

  @override
  int get second => _localDateTime.second;

  @override
  int get millisecond => _localDateTime.millisecond;

  @override
  int get microsecond => _localDateTime.microsecond;

  @override
  int get weekday => _localDateTime.weekday;

  @override
  String get timeZoneName => throw UnimplementedError();

  static final RegExp _parseFormat =
      RegExp(r'^([+-]?\d{4,6})-?(\d\d)-?(\d\d)' // Day part.
          r'(?:[ T](\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d+))?)?)?' // Time part.
          r'( ?[zZ]| ?([-+])(\d\d)(?::?(\d\d))?)?)?$'); // Timezone part.

  factory TimeWithTimeZone.fromUtc(DateTime utcTime, Duration offset) =>
      TimeWithTimeZone._(utcTime, offset);

  factory TimeWithTimeZone.fromLocal(DateTime local, Duration offset) =>
      TimeWithTimeZone._(local.toUtc(), offset);

  DateTime toFakeLocal() {
    // use it for date pickers and things like that
    return DateTime(
      _native.year,
      _native.month,
      _native.day,
      _native.hour,
      _native.minute,
      _native.second,
      _native.millisecond,
      _native.microsecond,
    ).add(offset);
  }

  factory TimeWithTimeZone.fromFakeLocal(DateTime local, Duration offset) {
    return TimeWithTimeZone(
      offset,
      local.year,
      local.month,
      local.day,
      local.hour,
      local.minute,
      local.second,
      local.millisecond,
      local.microsecond,
    );
  }
}
