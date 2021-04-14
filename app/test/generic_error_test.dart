import 'package:app/view/generic_error.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  // NOTE (JD): https://stackoverflow.com/questions/48498709/widget-test-fails-with-no-mediaquery-widget-found/48500804#48500804
  Widget createWidgetForTesting({required Widget child}) {
    return MaterialApp(home: child);
  }

  testWidgets('GenericErrorWidget', (WidgetTester tester) async {
    final String expectedError = "This is some error";
    await tester.pumpWidget(createWidgetForTesting(
        child: GenericError(errorMessage: expectedError)));

    expect(find.text(expectedError), findsOneWidget);
  });
}
