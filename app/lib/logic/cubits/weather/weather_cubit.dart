import 'package:app/logic/api_maps/weather.dart';
import 'package:app/logic/models/weather/weather_forecast.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

part 'weather_state.dart';

class WeatherCubit extends Cubit<WeatherState> {
  WeatherCubit() : super(WeatherWaiting());

  var api = WeatherApi();

  void fetchWeather(String routeId) async {
    emit(WeatherWaiting());

    var weather = await api.routeWeather(routeId);
    if (!isClosed) {
      emit(WeatherLoaded(weather: weather));
    }
  }
}
