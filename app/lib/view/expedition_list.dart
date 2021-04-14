import 'package:app/model/expedition.dart';
import 'package:flutter/material.dart';

class ExpeditionListScreen extends StatelessWidget {
  final List<Expedition> expeditions;
  final ValueChanged<Expedition> onTapped;

  ExpeditionListScreen({
    required this.expeditions,
    required this.onTapped,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("List of expeditions")),
      body: ListView(
        children: [
          for (var expedition in expeditions)
            ListTile(
              title: Text(expedition.name),
              onTap: () => onTapped(expedition),
            )
        ],
      ),
    );
  }
}
