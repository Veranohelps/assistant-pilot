import 'package:app/logic/api_maps/weather.dart';
import 'package:app/logic/models/weather/weather_forecast.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:flutter/material.dart';

class LiveMetiogram extends StatelessWidget {
  const LiveMetiogram({
    Key? key,
    required this.routeId,
  }) : super(key: key);

  final String routeId;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: FutureBuilder(
        future: WeatherApi().expeditionWeather(routeId),
        builder: (context, AsyncSnapshot<WeatherForecast?> snapshot) {
          if (snapshot.hasData) {
            return Center(
              child: InteractiveViewer(
                clipBehavior: Clip.none,
                panEnabled: true, // Set it to false
                minScale: 0.5,
                maxScale: 2,
                child: Image.network(snapshot.data!.meteograms[0].url),
              ),
            );
          }
          return BrandLoader();
        },
      ),
    );
  }
}
