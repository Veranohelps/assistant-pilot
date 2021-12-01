import 'package:app/logic/api_maps/dersu_api.dart';
import 'package:app/logic/models/expedition.dart';
import 'package:app/utils/extensions/iterable.dart';

const dashboardUrl = '/dashboard';

class DashboardApi extends PrivateDersuApi {
  Future<DashboardApiResponseDto> fetch() async {
    final client = await getClient();

    var res = await client.get(
      dashboardUrl,
    );
    client.close();

    var modules = ((res.data['data']?['modules'] ?? []) as List).map((el) {
      return el as Map<String, dynamic>;
    }).toList();

    var upcomingExpeditions = modules
        .firstWhereOrNull(
            (element) => element['id'] == 'upcomingExpedition')!['data']
        .map<ExpeditionShort>((data) => ExpeditionShort.fromJson(data))
        .toList();

    var pendingExpeditionInvite = modules
        .firstWhereOrNull(
            (element) => element['id'] == 'pendingExpeditionInvite')!['data']
        .map<ExpeditionShort>((data) => ExpeditionShort.fromJson(data))
        .toList();

    return DashboardApiResponseDto(
      pendingExpeditionInvite: pendingExpeditionInvite,
      upcomingExpeditions: upcomingExpeditions,
    );
  }
}

class DashboardApiResponseDto {
  List<ExpeditionShort> upcomingExpeditions;
  List<ExpeditionShort> pendingExpeditionInvite;

  DashboardApiResponseDto({
    required this.upcomingExpeditions,
    required this.pendingExpeditionInvite,
  });
}
