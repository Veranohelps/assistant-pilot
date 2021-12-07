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

  String toDayHourMinuteFormat() {
    this.toString();
<<<<<<< HEAD
    var segments = [
=======
    return [
>>>>>>> 3ac6eea (add estimation from activity)
      this.inHours.remainder(24),
      this.inMinutes.remainder(60),
    ].map((seg) {
      return seg.toString().padLeft(2, '0');
<<<<<<< HEAD
    });
    return segments.first + "h" + " " + segments.last + "m";
=======
    }).join(':');
>>>>>>> 3ac6eea (add estimation from activity)
  }
}
