import 'package:flutter/material.dart';

class HomePage extends Page {
  final expeditionListTapped;
  final aboutPageTapped;
  HomePage({required this.expeditionListTapped, required this.aboutPageTapped})
      : super(key: ValueKey("HomePage"));

  Route createRoute(BuildContext context) {
    return MaterialPageRoute(
      settings: this,
      builder: (BuildContext context) {
        return HomeScreen(
          expeditionListTapped: expeditionListTapped,
          aboutPageTapped: aboutPageTapped,
        );
      },
    );
  }
}

class HomeScreen extends StatelessWidget {
  final expeditionListTapped;
  final aboutPageTapped;
  HomeScreen(
      {required this.expeditionListTapped, required this.aboutPageTapped});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Dersu Assistant")),
      body: ListView(
        children: [
          ListTile(title: Text("👋 Hola!")),
          ElevatedButton(
            child: Text("Expediciones"),
            onPressed: expeditionListTapped,
          ),
          ElevatedButton(
            child: Text("Acerca de"),
            onPressed: aboutPageTapped,
          ),
        ],
      ),
    );
  }
}
