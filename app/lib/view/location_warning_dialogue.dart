import 'package:flutter/material.dart';

class LocationWarningDialogue extends AlertDialog {
  LocationWarningDialogue({required acceptHandler, required denyHandler})
      : super(
          key: Key("location-warning-dialogue"),
          title: new Text("Localización"),
          content: new Text(locationWarning),
          actions: <Widget>[
            TextButton(onPressed: denyHandler, child: Text('Cancelar')),
            TextButton(
              onPressed: acceptHandler,
              child: Text("Aceptar"),
            )
          ],
        );
}

final String locationWarning =
    "Dersu utiliza su localización durante las expediciones, incluso con la aplicación cerrada, "
    "para así poder avisarle de potenciales peligros, cambios meteorológicos relevantes "
    "y puntos de interés. Si lo desea puede consultar la política de privacidad de Dersu "
    "en la sección 'Acerca de' de la aplicación o en https://dersu.uz/en/privacy. Gracias.";
