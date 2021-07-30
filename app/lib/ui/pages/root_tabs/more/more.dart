import 'package:app/config/brand_colors.dart';
import 'package:app/ui/pages/console/console.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:flutter/material.dart';

import 'about/about.dart';

class More extends StatelessWidget {
  const More({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('More'),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _NavItem(
            title: 'Acerca de',
            goTo: About(),
          ),
          _NavItem(
            title: 'Console',
            goTo: Console(),
          ),
        ],
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  const _NavItem({
    Key? key,
    required this.goTo,
    required this.title,
  }) : super(key: key);

  final Widget goTo;
  final String title;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.of(context).push(materialRoute(goTo)),
      child: Container(
        decoration: BoxDecoration(
          border: Border(
            bottom: BorderSide(
              color: BrandColors.grey,
              width: 1,
            ),
          ),
        ),
        padding: EdgeInsets.symmetric(
          vertical: 24,
          horizontal: 20,
        ),
        child: Text(
          title,
        ),
      ),
    );
  }
}
