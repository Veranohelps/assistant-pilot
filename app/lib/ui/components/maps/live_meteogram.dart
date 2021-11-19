import 'package:app/config/theme_typo.dart';
import 'package:app/logic/api_maps/weather.dart';
import 'package:app/logic/models/weather/weather_forecast.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class LiveMetiogram extends StatefulWidget {
  const LiveMetiogram({
    Key? key,
    required this.expeditionId,
  }) : super(key: key);

  final String expeditionId;

  @override
  State<LiveMetiogram> createState() => _LiveMetiogramState();
}

class _LiveMetiogramState extends State<LiveMetiogram> {
  @override
  void initState() {
    super.initState();

    SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitUp,
      DeviceOrientation.landscapeRight,
      DeviceOrientation.landscapeLeft
    ]);
  }

  @override
  void dispose() {
    SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: FutureBuilder(
        future: WeatherApi().expeditionWeather(widget.expeditionId),
        builder: (context, AsyncSnapshot<WeatherForecast?> snapshot) {
          if (snapshot.hasData) {
            return Center(
              child: InteractiveViewer(
                clipBehavior: Clip.none,
                panEnabled: true, // Set it to false
                minScale: 0.5,
                maxScale: 2,
                child: ListView(
                    children: snapshot.data!.meteograms
                        .map((m) => Column(
                              children: [
                                SizedBox(height: 10),
                                Text(
                                  '${m.range[0]} m - ${m.range[1]} m',
                                  style: ThemeTypo.subtitle2,
                                ),
                                SizedBox(height: 5),
                                Image.network(m.url),
                              ],
                            ))
                        .toList()),
              ),
            );
          }
          return BrandLoader();
        },
      ),
    );
  }
}
