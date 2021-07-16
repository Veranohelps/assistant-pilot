import 'package:app/config/brand_text_styles.dart';
import 'package:app/config/brand_theme.dart';
import 'package:app/logic/model/expedition.dart';
import 'package:app/ui/components/brand_card/brand_card.dart';
import 'package:app/ui/components/brand_switcher/brand_switcher.dart';
import 'package:app/ui/pages/expedition/expedition.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:flutter/material.dart';
import 'package:app/utils/extensions/text_extension.dart';

class ExpeditionDetails extends StatefulWidget {
  const ExpeditionDetails({
    Key? key,
    required this.expedition,
  }) : super(key: key);

  final Expedition expedition;

  @override
  _ExpeditionDetailsState createState() => _ExpeditionDetailsState();
}

class _ExpeditionDetailsState extends State<ExpeditionDetails> {
  bool isLive = false;

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
            Text('Inormation').h6,
            textLine('Name: ', widget.expedition.name),
            textLine('Waypoint count: ',
                widget.expedition.waypoints.length.toString()),
            SizedBox(height: 20),
            Text('Routes').h6,
            textLine(
                'Rounts count: ', widget.expedition.routes.length.toString()),
            SizedBox(height: 20),
            GestureDetector(
              onTap: handleIsLiveSwithcer,
              child: Row(
                children: [
                  Text('Is live: '),
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
                              routeId: routePreInfo.id,
                              isLive: isLive,
                            ),
                          ),
                        );
                      },
                      child: BrandCard(
                        child: Row(
                          children: [
                            Text('Route: ${i + 1},\nid: ${routePreInfo.id}')
                                .bodySmall,
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
      style: BrandTextStyles.body,
      children: [
        TextSpan(text: label),
        TextSpan(
          text: text,
          style: BrandTextStyles.h4,
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
