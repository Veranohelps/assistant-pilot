import 'package:app/view/generic_error.dart';
import 'package:app/view/generic_loader.dart';
import 'package:flutter/material.dart';
import 'package:package_info/package_info.dart';

class AboutPage extends MaterialPage {
  AboutPage()
      : super(
            key: ValueKey("AboutPage"),
            child: FutureBuilder<PackageInfo>(
              future: PackageInfo.fromPlatform(),
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  return AboutScreen(packageInfo: snapshot.data!);
                } else if (snapshot.hasError) {
                  print("Error while fetching application info 👇");
                  print(snapshot.error);
                  return GenericError(errorMessage: snapshot.error.toString());
                }

                return GenericLoader();
              },
            ));
}

class AboutScreen extends StatelessWidget {
  final PackageInfo packageInfo;
  AboutScreen({required this.packageInfo});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Acerca de")),
      body: ListView(
        children: [
          ListTile(title: Text("Versión: " + packageInfo.version)),
          ListTile(title: Text("Build: " + packageInfo.buildNumber)),
        ],
      ),
    );
  }
}
