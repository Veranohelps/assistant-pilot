import 'package:app/config/brand_colors.dart';
import 'package:flutter/material.dart';
import 'package:unicons/unicons.dart';

final _kBottomTabBarHeight = 51;

class BrandTabBar extends StatefulWidget {
  BrandTabBar({Key? key, this.controller}) : super(key: key);

  final TabController? controller;
  @override
  _BrandTabBarState createState() => _BrandTabBarState();
}

class _BrandTabBarState extends State<BrandTabBar> {
  int? currentIndex;
  @override
  void initState() {
    currentIndex = widget.controller!.index;
    widget.controller!.addListener(_listener);
    super.initState();
  }

  _listener() {
    if (currentIndex != widget.controller!.index) {
      setState(() {
        currentIndex = widget.controller!.index;
      });
    }
  }

  @override
  void dispose() {
    widget.controller ?? widget.controller!.removeListener(_listener);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final paddingBottom = MediaQuery.of(context).padding.bottom;

    return SizedBox(
      height: paddingBottom + _kBottomTabBarHeight,
      child: Container(
        decoration: BoxDecoration(
            boxShadow: kElevationToShadow[1], color: BrandColors.white),
        padding: EdgeInsets.symmetric(horizontal: 16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: _getIconButton('Expeditions', UniconsLine.sign_alt, 0),
            ),
            Expanded(
              child: _getIconButton('More', UniconsLine.setting, 1),
            )
          ],
        ),
      ),
    );
  }

  _getIconButton(String label, IconData iconData, int index) {
    var isActive = currentIndex == index;
    var color = isActive ? BrandColors.active : BrandColors.inactive;
    return InkWell(
      onTap: () => widget.controller!.animateTo(index),
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
    );
  }
}
