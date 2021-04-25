import 'package:app/model/models.dart';
import 'package:app/view/generic_error.dart';
import 'package:app/view/generic_loader.dart';
import 'package:flutter/material.dart';

class ExpeditionListPage extends MaterialPage {
  final Future<List<Expedition>> futureExpeditions;
  final expeditionTapped;
  ExpeditionListPage(
      {required this.futureExpeditions, required this.expeditionTapped})
      : super(
            key: ValueKey("ExpeditionListPage"),
            child: FutureBuilder<List<Expedition>>(
              future: futureExpeditions,
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  return ExpeditionListScreen(
                      expeditions: snapshot.data!, onTapped: expeditionTapped);
                } else if (snapshot.hasError) {
                  print("Error while fetching expeditions 👇");
                  print(snapshot.error);
                  return GenericError(errorMessage: snapshot.error.toString());
                }

                return GenericLoader();
              },
            ));
}

class ExpeditionListScreen extends StatelessWidget {
  final List<Expedition> expeditions;
  final onTapped;

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
