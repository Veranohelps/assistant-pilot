// ignore_for_file: unnecessary_this

extension DurationFormatter on Duration {
  String toDayHourMinuteSecondFormat() {
    this.toString();
    return [
      this.inHours.remainder(24),
      this.inMinutes.remainder(60),
      this.inSeconds.remainder(60)
    ].map((seg) {
      return seg.toString().padLeft(2, '0');
    }).join(':');
  }
}
