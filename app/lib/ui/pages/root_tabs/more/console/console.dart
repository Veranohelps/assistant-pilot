import 'dart:collection';

import 'package:app/config/brand_colors.dart';
import 'package:app/config/brand_text_styles.dart';
import 'package:app/config/brand_theme.dart';
import 'package:app/config/get_it_config.dart';
import 'package:app/logic/model/console_message.dart';
import 'package:flutter/material.dart';

class Console extends StatefulWidget {
  const Console({Key? key}) : super(key: key);

  @override
  _ConsoleState createState() => _ConsoleState();
}

class _ConsoleState extends State<Console> {
  @override
  void initState() {
    getIt.get<ConsoleService>().addListener(update);

    super.initState();
  }

  @override
  void dispose() {
    getIt<ConsoleService>().removeListener(update);
    super.dispose();
  }

  void update() => setState(() => {});

  @override
  Widget build(BuildContext context) {
    var messages = getIt.get<ConsoleService>().messages;

    return Scaffold(
      appBar: AppBar(
        title: Text('Console'),
      ),
      body: messages.isEmpty
          ? Center(child: Text('No messages'))
          : ListView(
              reverse: true,
              padding: paddingH25V0,
              children: [
                SizedBox(height: 20),
                ...UnmodifiableListView(messages
                    .map((message) {
                      var isError = message.type == MessageType.warning;
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4),
                        child: RichText(
                          text: TextSpan(
                            style: BrandTextStyles.body,
                            children: <TextSpan>[
                              TextSpan(
                                text:
                                    '${message.timeString}${isError ? '(Error)' : ''}: \n',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: isError
                                      ? BrandColors.errors
                                      : BrandColors.black,
                                ),
                              ),
                              TextSpan(text: message.text),
                            ],
                          ),
                        ),
                      );
                    })
                    .toList()
                    .reversed),
              ],
            ),
    );
  }
}
