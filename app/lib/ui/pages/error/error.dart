import 'package:flutter/material.dart';
import 'package:app/utils/extensions/text_extension.dart';

class ErrorScreen extends StatelessWidget {
  const ErrorScreen({Key? key, this.error, this.stackTrace}) : super(key: key);

  final Object? error;
  final StackTrace? stackTrace;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Error")),
      body: Column(
        children: [
          Text(error.toString()).h4,
          if (stackTrace != null) ...[
            Text('stackTrace: ').h6,
            Text(stackTrace.toString()).bodyExtraSmall,
          ],
        ],
      ),
    );
  }
}
