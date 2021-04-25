import 'package:app/model/models.dart';
import 'package:app/view/generic_error.dart';
import 'package:app/view/generic_loader.dart';
import 'package:flutter/material.dart';

class ExpeditionDetailsPage extends MaterialPage {
  final Future<DersuRoute> futureRoute;
  final Expedition expedition;
  final ValueChanged<DersuRoute> onMapSelected;

  ExpeditionDetailsPage(
      {required this.expedition,
      required this.futureRoute,
      required this.onMapSelected})
      : super(
            key: ValueKey("ExpeditionDetailsPage"),
            child: FutureBuilder<DersuRoute>(
              future: futureRoute,
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  return ExpeditionDetailsScreen(
                      expedition: expedition,
                      route: snapshot.data!,
                      onMapSelected: onMapSelected);
                } else if (snapshot.hasError) {
                  print("Error while fetching route 👇");
                  print(snapshot.error);
                  return GenericError(errorMessage: snapshot.error.toString());
                }

                return GenericLoader();
              },
            ));
}

class ExpeditionDetailsScreen extends StatelessWidget {
  final Expedition expedition;
  final DersuRoute route;
  final ValueChanged<DersuRoute> onMapSelected;

  ExpeditionDetailsScreen(
      {required this.expedition,
      required this.route,
      required this.onMapSelected});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Expedition")),
      body: ListView(
        children: [
          ListTile(title: Text(expedition.name)),
          ListTile(
            title: Text("See map"),
            onTap: () => onMapSelected(route),
          )
        ],
      ),
    );
  }
}
