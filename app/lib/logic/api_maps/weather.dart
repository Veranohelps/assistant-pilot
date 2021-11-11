import 'package:app/logic/models/weather/weather_forecast.dart';
import 'package:dio/dio.dart';

import 'dersu_api.dart';

class WeatherApi extends PrivateDersuApi {
  Future<WeatherForecast> routeWeather(String id) async {
    final client = await getClient();
    var res = await client.get(
      '/route/$id/weather',
    );
    client.close();
    return WeatherForecast.fromJson(res.data);
  }

  Future<WeatherForecast?> expeditionWeather(String id) async {
    try {
      final client = await getClient();
      Response res;
      res = await client.get(
        '/route/$id/weather',
      );
      client.close();
      return WeatherForecast.fromJson(res.data);
    } catch (e) {
      print(e);
    }
  }
}
