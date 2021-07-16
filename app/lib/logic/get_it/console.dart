import 'package:app/logic/model/console_message.dart';
import 'package:flutter/material.dart';

class ConsoleService extends ChangeNotifier {
  List<ConsoleMessage> _messages = [];

  List<ConsoleMessage> get messages => _messages;

  void addMessage(ConsoleMessage message) {
    messages.add(message);
    notifyListeners();
  }
}
