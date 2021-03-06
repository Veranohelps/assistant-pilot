part of 'weather_cubit.dart';

abstract class WeatherState extends Equatable {
  const WeatherState();
  @override
  List<Object> get props => [];
}

class WeatherWaiting extends WeatherState {}

class WeatherLoaded extends WeatherState {
  final WeatherForecast weather;

  const WeatherLoaded({
    required this.weather,
  });

  @override
  List<Object> get props => [weather];
}
