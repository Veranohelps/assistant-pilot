import 'package:hive_flutter/hive_flutter.dart';
import 'package:intl/intl.dart';

part 'console_message.g.dart';

final formater = new DateFormat('hh:mm');
final formater2 = DateFormat('MM-dd hh:mm');

@HiveType(typeId: 1)
class ConsoleMessage {
  ConsoleMessage({this.text, this.type = MessageType.normal})
      : time = DateTime.now();
  @HiveField(0)
  final String? text;
  @HiveField(1)
  final DateTime time;
  @HiveField(2)
  final MessageType type;
  String get timeString => formater.format(time);

  factory ConsoleMessage.warn({String? text}) => ConsoleMessage(
        text: text,
        type: MessageType.warning,
      );

  @override
  String toString() => '${formater2.format(time)}: $text';
}

@HiveType(typeId: 2)
enum MessageType {
  @HiveField(0)
  normal,
  @HiveField(1)
  warning,
}
