import 'package:app/config/theme_typo.dart';
import 'package:app/config/brand_theme.dart';
import 'package:app/config/geofence.dart';
import 'package:app/config/hive_config.dart';
import 'package:app/logic/model/expedition.dart';
import 'package:app/ui/components/brand_card/brand_card.dart';
import 'package:app/ui/components/brand_switcher/brand_switcher.dart';
import 'package:app/ui/pages/expedition/expedition.dart';
import 'package:app/utils/extensions/text_extension.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';

class ExpeditionDetails extends StatefulWidget {
  const ExpeditionDetails({
    Key? key,
    required this.expedition,
    this.isLife = false,
  }) : super(key: key);

  final Expedition expedition;
  final bool isLife;

  @override
  _ExpeditionDetailsState createState() => _ExpeditionDetailsState();
}

class _ExpeditionDetailsState extends State<ExpeditionDetails> {
  late bool isLive;
  late int waypointPrecision;
  final geoConig = Hive.box(HiveContants.geoConfig.txt);
  @override
  void initState() {
    waypointPrecision = geoConig.get(
      HiveContants.waypointPrecision.txt,
      defaultValue: kWaypointPrecisionDefault,
    );

    isLive = widget.isLife;
    super.initState();
  }

  void updatePrecision(newPrecision) async {
    await geoConig.put(HiveContants.waypointPrecision.txt, newPrecision);
    setState(() => {waypointPrecision = newPrecision.toInt()});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.expedition.name),
      ),
      body: Padding(
        padding: paddingH25V0,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            SizedBox(height: 20),
            Text(widget.expedition.name).h6,
            SizedBox(height: 20),
            textLine('Waypoint count: ',
                widget.expedition.waypoints.length.toString()),
            Text('Routes: ' + widget.expedition.routes.length.toString()),
            SizedBox(height: 20),
            Text("Precisión: $waypointPrecision metros"),
            Slider(
              value: waypointPrecision.toDouble(),
              min: 50,
              max: 200,
              divisions: 3,
              onChanged: (isLive) ? null : (v) => updatePrecision(v.toInt()),
            ),
            SizedBox(height: 20),
            GestureDetector(
              onTap: handleIsLiveSwithcer,
              child: Row(
                children: [
                  Text('En progreso: '),
                  BrandSwitcher(
                    isAcitve: isLive,
                  ),
                ],
              ),
            ),
            SizedBox(height: 20),
            ...widget.expedition.routes
                .asMap()
                .map((i, routePreInfo) => MapEntry(
                    i,
                    GestureDetector(
                      onTap: () {
                        Navigator.of(context).push(
                          materialRoute(
                            ExpeditionPage(
                              expedition: widget.expedition,
                              dersuUrl: routePreInfo,
                              isLive: isLive,
                              waypointPrecision: waypointPrecision,
                            ),
                            widget.expedition.name,
                          ),
                        );
                      },
                      child: BrandCard(
                        child: Row(
                          children: [
                            ElevatedButton(
                                onPressed: null,
                                child: Text(isLive ? "COMENZAR" : "CONSULTAR"))
                          ],
                        ),
                      ),
                    )))
                .values
                .toList(),
          ],
        ),
      ),
    );
  }

  Future<void> handleIsLiveSwithcer() async {
    bool? newIsLive;

    if (isLive) {
      newIsLive = false;
    } else {
      var res = await showDialog(
        routeSettings: RouteSettings(
          name: 'Alert dialog',
          arguments: 'location-warning-dialogue',
        ),
        context: context,
        builder: (context) => AlertDialog(
          key: Key("location-warning-dialogue"),
          title: new Text("Localización"),
          content: new Text(locationWarning),
          actions: <Widget>[
            TextButton(
                onPressed: () => Navigator.of(context).pop(false),
                child: Text('Cancelar')),
            TextButton(
              onPressed: () => Navigator.of(context).pop(true),
              child: Text("Aceptar"),
            )
          ],
        ),
      );
      if (res != null && res) {
        newIsLive = true;
      }
    }

    if (newIsLive != null) {
      setState(
        () => isLive = newIsLive!,
      );
    }
  }
}

Widget textLine(String label, String text) {
  return RichText(
    text: TextSpan(
      style: ThemeTypo.p0,
      children: [
        TextSpan(text: label),
        TextSpan(
          text: text,
          style: ThemeTypo.h4,
        )
      ],
    ),
  );
}

final String locationWarning =
    "Dersu utiliza su localización durante las expediciones, incluso con la aplicación cerrada, "
    "para así poder avisarle de potenciales peligros, cambios meteorológicos relevantes "
    "y puntos de interés. Si lo desea puede consultar la política de privacidad de Dersu "
    "en la sección 'Acerca de' de la aplicación o en https://dersu.uz/en/privacy. Gracias.";
