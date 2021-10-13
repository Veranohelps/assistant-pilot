import 'package:app/logic/api_maps/dersu_api.dart';
import 'package:app/logic/models/expedition.dart';
import 'package:app/utils/extensions/iterable.dart';
import 'package:either_option/either_option.dart';

final dashboardUrl = '/dashboard';

class DashboardApi extends PrivateDersuApi {
  Future<Option<List<ExpeditionShort>>> fetch() async {
    final client = await getClient();

    var res = await client.get(
      dashboardUrl,
    );
    client.close();

    var modules = ((res.data['data']?['modules'] ?? []) as List).map((el) {
      return el as Map<String, dynamic>;
    }).toList();

    var upcomingExpeditionObject = modules
        .firstWhereOrNull((element) => element['id'] == 'upcomingExpedition');

    if (upcomingExpeditionObject == null) {
      return Option.empty();
    }

    var list = upcomingExpeditionObject['data']
        .map<ExpeditionShort>((data) => ExpeditionShort.fromJson(data))
        .toList();

    return Option.of<List<ExpeditionShort>>(list);
  }
}
