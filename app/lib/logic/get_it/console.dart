import 'package:app/config/hive_config.dart';
import 'package:app/logic/models/console_message.dart';
import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';

import 'package:share_plus/share_plus.dart';

class ConsoleService extends ChangeNotifier {
  final List<ConsoleMessage> _messages = [];

  List<ConsoleMessage> get messages => _messages;
  final box = Hive.box<ConsoleMessage>(HiveContants.console.txt);

  Future<void> load() async {
    var loadedMessages = box.values.toList();
    _messages.addAll(loadedMessages);
    addMessage(ConsoleMessage(text: 'the app started'));
  }

  void addMessage(ConsoleMessage message) {
    messages.add(message);
    box.add(message);
    notifyListeners();
  }

  void clean() async {
    await box.clear();
    _messages.clear();
    notifyListeners();
  }

  void sendFile() async {
    Directory tempDir = await getTemporaryDirectory();
    String filePath = '${tempDir.path}/logfile.txt';
    final file = File(filePath);
    await file.writeAsString(_messages.join('\n'));
    await Share.shareFiles([filePath], text: 'Dersu console logs');
  }
}
