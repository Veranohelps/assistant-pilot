import 'package:app/model/expedition.dart';
import 'package:flutter/material.dart';

class ExpeditionDetailsPage extends Page {
  final Expedition expedition;
  final ValueChanged<bool> onMapSelected;

  ExpeditionDetailsPage({required this.expedition, required this.onMapSelected})
      : super(key: ValueKey(expedition.toString()));

  Route createRoute(BuildContext context) {
    return MaterialPageRoute(
      settings: this,
      builder: (BuildContext context) {
        return ExpeditionDetailsScreen(
          expedition: expedition,
          onMapSelected: onMapSelected,
        );
      },
    );
  }
}

class ExpeditionDetailsScreen extends StatelessWidget {
  final Expedition expedition;
  final ValueChanged<bool> onMapSelected;

  ExpeditionDetailsScreen(
      {required this.expedition, required this.onMapSelected});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Expedition")),
      body: ListView(
        children: [
          ListTile(title: Text(expedition.name)),
          ListTile(
            title: Text("See map"),
            onTap: () => onMapSelected(true),
          )
        ],
      ),
    );
  }
}
