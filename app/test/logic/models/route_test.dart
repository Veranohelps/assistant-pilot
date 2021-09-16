import 'package:app/logic/model/url.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('DersuUrlModel', () {
    test('', () {
      var json = {'id': 'id1', 'url': 'url1'};
      var route = DersuUrlModel.fromJson(json);
      expect(route.id, json['id']);
      expect(route.url, json['url']);
    });
  });
}
