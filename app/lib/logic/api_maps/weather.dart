import 'package:app/logic/models/weather/daily_forecast.dart';

import 'dersu_api.dart';

class WeatherApi extends PrivateDersuApi {
  Future<List<DayForecast>> weather(String id, DateTime dateTime) async {
    final client = await getClient();
    var res = await client.get('/route/$id/weather',
        queryParameters: {"dateTime": dateTime.toIso8601String()});
    client.close();
    return res.data
        .map<DayForecast>((json) => DayForecast.fromJson(json))
        .toList();
  }
}
