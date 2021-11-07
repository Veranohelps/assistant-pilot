import 'package:app/config/get_it_config.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:app/logic/get_it/analytics.dart';
import 'package:app/ui/components/brand_tab_bar/brand_tab_bar.dart';
import 'package:app/ui/pages/root_tabs/dashboard/dashboard.dart';
import 'package:app/ui/pages/root_tabs/more/more.dart';
import 'package:app/ui/pages/root_tabs/profile/profile.dart';
import 'package:app/ui/pages/root_tabs/routes/routes.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:unicons/unicons.dart';

class RootPage extends StatefulWidget {
  const RootPage({Key? key}) : super(key: key);

  @override
  _RootPageState createState() => _RootPageState();
}

final tabsData = [
  [
    LocaleKeys.dashboard_name,
    Icons.filter_hdr_outlined,
  ],
  [
    LocaleKeys.planning_name,
    Icons.map_outlined,
  ],
  [
    LocaleKeys.profile_name,
    Icons.account_circle_outlined,
  ],
  [
    LocaleKeys.more_name,
    UniconsLine.setting,
  ],
];

class _RootPageState extends State<RootPage>
    with SingleTickerProviderStateMixin {
  late TabController tabController;

  @override
  void initState() {
    tabController = TabController(length: tabsData.length, vsync: this)
      ..addListener(_listener);
    super.initState();
  }

  void _listener() {
    if (tabController.indexIsChanging) {
      getIt<Analitics>().sendScreensEvent(
        action: PageEventTypes.tab,
        name:
            '${(tabsData[tabController.index][0] as String).split('.')[0]} tab',
      );
    }
  }

  @override
  void dispose() {
    super.dispose();
    tabController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Provider<ChangeTab>(
        create: (_) => ChangeTab(tabController.animateTo),
        child: TabBarView(
          controller: tabController,
          children: const [
            Dashboard(),
            RoutesTab(),
            ProfileTab(),
            More(),
          ],
        ),
      ),
      bottomNavigationBar: BrandTabBar(
        controller: tabController,
        tabsData: tabsData,
      ),
    );
  }
}

class ChangeTab {
  final ValueChanged<int> onPress;

  ChangeTab(this.onPress);
}
