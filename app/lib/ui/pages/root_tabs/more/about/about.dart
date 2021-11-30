// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:package_info/package_info.dart';

import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:app/ui/pages/errors/basic.dart';
import 'package:app/ui/pages/loader/generic_loader.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:app/logic/service/external_urls.dart';
import 'package:easy_localization/easy_localization.dart';

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
            return BasicErrorScreen(error: snapshot.error);
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
  const AboutScreen({
    Key? key,
    required this.packageInfo,
    required this.whatsNew,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(LocaleKeys.more_about.tr())),
      body: ListView(
        padding: EdgeInsets.symmetric(horizontal: 20),
        children: [
          ListTile(
              title: Text(LocaleKeys.more_app_version.tr() +
                  ': ' +
                  packageInfo.version +
                  ' - ' +
                  packageInfo.buildNumber)),
          ListTile(title: Text(whatsNew)),
          BrandButtons.primaryBig(
            onPressed: () => ExternalUrls.launchPrivacyPolicy(context.locale),
            text: LocaleKeys.more_privacy_policy.tr(),
          ),
          BrandButtons.primaryBig(
            onPressed: () =>
                ExternalUrls.launchTermsAndConditions(context.locale),
            text: LocaleKeys.more_terms_and_conditions.tr(),
          )
        ],
      ),
    );
  }
}
