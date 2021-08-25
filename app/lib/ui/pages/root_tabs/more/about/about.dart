import 'package:app/ui/pages/error/error.dart';
import 'package:app/ui/pages/loader/generic_loader.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_config/flutter_config.dart';
import 'package:package_info/package_info.dart';
import 'package:url_launcher/url_launcher.dart';

class About extends StatelessWidget {
  const About({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<AboutScreenData>(
      future: getPageData(),
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          return AboutScreen(
              packageInfo: snapshot.data!.packageInfo,
              whatsNew: snapshot.data!.whatsNew);
        } else {
          if (snapshot.hasError) {
            print("Error while fetching application info 👇");
            print(snapshot.error);
            return ErrorScreen(error: snapshot.error);
          }
        }

        return LoadingPage();
      },
    );
  }

  static Future<AboutScreenData> getPageData() async {
    PackageInfo _info = await PackageInfo.fromPlatform();
    String _whatsNew =
        await rootBundle.loadString('distribution/whatsnew/whatsnew-es-ES');

    return AboutScreenData(packageInfo: _info, whatsNew: _whatsNew);
  }
}

class AboutScreenData {
  final PackageInfo packageInfo;
  final String whatsNew;

  AboutScreenData({required this.packageInfo, required this.whatsNew});
}

class AboutScreen extends StatelessWidget {
  final PackageInfo packageInfo;
  final String whatsNew;
  AboutScreen({required this.packageInfo, required this.whatsNew});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Acerca de")),
      body: ListView(
        children: [
          ListTile(title: Text("Versión: " + packageInfo.version)),
          ListTile(title: Text("Build: " + packageInfo.buildNumber)),
          ListTile(title: Text(whatsNew)),
          ElevatedButton(
              onPressed: _launchPrivacyPolicy,
              child: Text("Política de privacidad"))
        ],
      ),
    );
  }

  void _launchPrivacyPolicy() async {
    final baseUrl = FlutterConfig.get('DERSU_SITE_BASE_URL');
    final url = '$baseUrl/en/privacy/';
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }
}
