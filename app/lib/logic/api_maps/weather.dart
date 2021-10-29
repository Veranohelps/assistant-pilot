import 'package:app/logic/models/weather/weather_forecast.dart';

import 'dersu_api.dart';

class WeatherApi extends PrivateDersuApi {
  Future<WeatherForecast> weather(String id) async {
    final client = await getClient();
    var res = await client.get(
      '/route/$id/weather',
    );
    client.close();
    return WeatherForecast.fromJson(res.data);
  }
}
