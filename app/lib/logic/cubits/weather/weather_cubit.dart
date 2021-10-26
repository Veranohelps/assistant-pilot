import 'dart:async';

import 'package:app/logic/api_maps/weather.dart';
import 'package:app/logic/cubits/route/route_cubit.dart';
import 'package:app/logic/cubits/time_filter/time_filter_cubit.dart';
import 'package:app/logic/models/weather/daily_forecast.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

part 'weather_state.dart';

class WeatherCubit extends Cubit<WeatherState> {
  WeatherCubit(this.routeCubit, this.timeFilterCubit)
      : super(WeatherWaiting()) {
    routeSubscription = routeCubit.stream.listen(fetchWeather);
    timeSubscription = timeFilterCubit.stream.listen(fetchWeather);

    fetchWeather();
  }

  RouteCubit routeCubit;
  TimeFilterCubit timeFilterCubit;

  @override
  Future<void> close() {
    routeSubscription.cancel();
    timeSubscription.cancel();
    return super.close();
  }

  late StreamSubscription routeSubscription;
  late StreamSubscription timeSubscription;

  var api = WeatherApi();

  void fetchWeather([_]) async {
    emit(WeatherWaiting());
    String? routeId = routeCubit.state?.id;
    DateTime? dateTime = timeFilterCubit.state;

    if (routeId == null || dateTime == null) {
      return;
    }
    var res = await api.weather(routeId, dateTime);
    emit(WeatherLoaded(weather: res));
  }
}
