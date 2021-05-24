import 'package:app/view/generic_error.dart';
import 'package:app/view/generic_loader.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:package_info/package_info.dart';
import 'package:url_launcher/url_launcher.dart';

class AboutPage extends MaterialPage {
  AboutPage()
      : super(
            key: ValueKey("AboutPage"),
            child: FutureBuilder<AboutScreenData>(
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
                    return GenericError(
                        errorMessage: snapshot.error.toString());
                  }
                }

                return GenericLoader();
              },
            ));

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
    final String DERSU_SITE_BASE_URL = env['DERSU_SITE_BASE_URL']!;
    final url = DERSU_SITE_BASE_URL + '/en/privacy/';
    if (await canLaunch(url)) {
      await launch(url);
    } else {
      throw 'Could not launch $url';
    }
  }
}
