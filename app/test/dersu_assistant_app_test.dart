import 'package:app/main.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('DersuAssistantApp', (WidgetTester tester) async {
    await tester.pumpWidget(DersuAssistantApp());
  });
}
