import 'package:app/logic/models/waypoint.dart';
import 'package:app/logic/models/waypoint_type.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:flutter/material.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:easy_localization/easy_localization.dart';

class ThreeByThreeTest extends StatelessWidget {
  final Waypoint waypoint;
  final List<WaypointType> waypointTypes;
  final VoidCallback closeCallback;

  const ThreeByThreeTest(
      {Key? key,
      required this.waypoint,
      required this.waypointTypes,
      required this.closeCallback})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        closeCallback();
        return true;
      },
      child: Scaffold(
        appBar: AppBar(
          title: Text("3x3"),
        ),
        body: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                waypoint.name,
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              if (waypoint.typeIds.isNotEmpty)
                Text(LocaleKeys.expedition_three_by_three_waypoint_type.tr() +
                    ": " +
                    waypointTypes
                        .singleWhere((waypointType) =>
                            waypointType.id == waypoint.typeIds.first)
                        .name),
              SizedBox(height: 20),
              if (waypoint.description != null) Text(waypoint.description!),
              SizedBox(height: 20),
              Text(LocaleKeys.expedition_three_by_three_title.tr(),
                  style: TextStyle(fontWeight: FontWeight.bold)),
              SizedBox(height: 20),
              ExpandableCard(
                  title: LocaleKeys.expedition_three_by_three_conditions_title
                      .tr(),
                  hint:
                      LocaleKeys.expedition_three_by_three_conditions_hint.tr(),
                  text: LocaleKeys.expedition_three_by_three_conditions_text
                      .tr()),
              SizedBox(height: 15),
              ExpandableCard(
                  title:
                      LocaleKeys.expedition_three_by_three_terrain_title.tr(),
                  hint: LocaleKeys.expedition_three_by_three_terrain_hint.tr(),
                  text: LocaleKeys.expedition_three_by_three_terrain_text.tr()),
              SizedBox(height: 15),
              ExpandableCard(
                  title: LocaleKeys.expedition_three_by_three_group_title.tr(),
                  hint: LocaleKeys.expedition_three_by_three_group_hint.tr(),
                  text: LocaleKeys.expedition_three_by_three_group_text.tr()),
              SizedBox(height: MediaQuery.of(context).padding.bottom),
              BrandButtons.primaryBig(
                  text: LocaleKeys.expedition_three_by_three_continue.tr(),
                  onPressed: () {
                    Navigator.of(context).pop();
                    closeCallback();
                  })
            ],
          ),
        ),
      ),
    );
  }
}

class ExpandableCard extends StatelessWidget {
  final String title;
  final String hint;
  final String text;
  const ExpandableCard(
      {Key? key, required this.title, required this.hint, required this.text})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: TextStyle(fontWeight: FontWeight.bold)),
        SizedBox(height: 5),
        Text(hint),
        SizedBox(height: 5),
        Text(text)
      ],
    );
  }
}
