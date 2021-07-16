import 'package:app/ui/components/brand_tab_bar/brand_tab_bar.dart';
import 'package:app/ui/pages/root_tabs/more/more.dart';
import 'package:app/ui/pages/root_tabs/expeditions/expeditions.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class RootPage extends StatefulWidget {
  const RootPage({Key? key}) : super(key: key);

  @override
  _RootPageState createState() => _RootPageState();
}

class _RootPageState extends State<RootPage>
    with SingleTickerProviderStateMixin {
  late TabController tabController;

  @override
  void initState() {
    tabController = TabController(length: 2, vsync: this);
    super.initState();
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
          children: [
            ExpeditionsDetails(),
            More(),
          ],
        ),
      ),
      bottomNavigationBar: BrandTabBar(
        controller: tabController,
      ),
    );
  }
}

class ChangeTab {
  final ValueChanged<int> onPress;

  ChangeTab(this.onPress);
}
