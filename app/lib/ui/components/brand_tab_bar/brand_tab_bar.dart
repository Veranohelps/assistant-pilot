import 'package:app/config/brand_colors.dart';
import 'package:flutter/material.dart';
import 'package:easy_localization/easy_localization.dart';

const _kBottomTabBarHeight = 51.0;

class BrandTabBar extends StatefulWidget {
  const BrandTabBar({
    Key? key,
    required this.controller,
    required this.tabsData,
  }) : super(key: key);

  final TabController controller;
  final List<List> tabsData;
  @override
  _BrandTabBarState createState() => _BrandTabBarState();
}

class _BrandTabBarState extends State<BrandTabBar> {
  int? currentIndex;
  @override
  void initState() {
    currentIndex = widget.controller.index;
    widget.controller.addListener(_listener);
    super.initState();
  }

  _listener() {
    if (currentIndex != widget.controller.index) {
      setState(() {
        currentIndex = widget.controller.index;
      });
    }
  }

  @override
  void dispose() {
    widget.controller.removeListener(_listener);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final paddingBottom = MediaQuery.of(context).padding.bottom;
    return Container(
      height: _kBottomTabBarHeight + paddingBottom,
      decoration: BoxDecoration(
        boxShadow: kElevationToShadow[1],
        color: BrandColors.earthBlack,
      ),
      padding: EdgeInsets.symmetric(horizontal: 16),
      child: SafeArea(
        child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: widget.tabsData
                .asMap()
                .map((index, value) {
                  return MapEntry(
                      index,
                      _getIconButton(
                        (value[0] as String).tr(),
                        value[1] as IconData,
                        index,
                      ));
                })
                .values
                .toList()),
      ),
    );
  }

  Widget _getIconButton(String label, IconData iconData, int index) {
    var isActive = currentIndex == index;
    var color = isActive ? BrandColors.active : BrandColors.inactive;
    return Expanded(
      child: InkWell(
        onTap: () => widget.controller.animateTo(index),
        child: Padding(
          padding: EdgeInsets.all(6),
          child: ConstrainedBox(
            constraints: BoxConstraints(minWidth: 40),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Icon(iconData, color: color),
                SizedBox(height: 3),
                Text(label,
                    style: TextStyle(
                      fontSize: 9,
                      color: color,
                    )),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
