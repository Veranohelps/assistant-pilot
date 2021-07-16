import 'package:app/app.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('DersuAssistantApp', (WidgetTester tester) async {
    await tester.pumpWidget(App());
  });
}
