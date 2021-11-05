// ignore_for_file: prefer_const_constructors

import 'package:app/config/brand_colors.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:app/logic/cubits/dictionaries/dictionaries_cubit.dart';
import 'package:app/logic/cubits/expedition/expedition_cubit.dart';
import 'package:app/logic/cubits/live/live_cubit.dart';
import 'package:app/logic/models/activity_type.dart';
import 'package:app/logic/models/expedition.dart';
import 'package:app/logic/get_it/background_geolocation.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:app/ui/components/maps/static_map.dart';
import 'package:app/ui/pages/expedition_live/expedition_live.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:cubit_form/cubit_form.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:easy_localization/easy_localization.dart';

var format = DateFormat.MMMMd().add_Hm();

class ExpeditionPage extends StatefulWidget {
  const ExpeditionPage({
    required this.expedition,
    Key? key,
  }) : super(key: key);

  final ExpeditionShort expedition;

  @override
  State<ExpeditionPage> createState() => _ExpeditionPageState();
}

class _ExpeditionPageState extends State<ExpeditionPage> {
  bool isMapExpanded = false;

  @override
  Widget build(BuildContext context) {
    var dict = context.read<DictionariesCubit>().state;
    if (dict is! DictionariesLoaded) {
      return BrandLoader();
    }
    return BlocProvider<ExpeditionCubit>(
      create: (_) => ExpeditionCubit()..getExpedition(widget.expedition.url),
      child: Builder(builder: (context) {
        var fullExpedition = context.watch<ExpeditionCubit>().state;

        late List<ActivityType> actitvityTypes = [];

        if (fullExpedition != null) {
          actitvityTypes.addAll(fullExpedition.activityTypeIds
              .map((id) => dict.findActiveTypeById(id)));
        }

        return Scaffold(
          appBar: AppBar(
            title: Text(widget.expedition.name),
          ),
          bottomNavigationBar: SafeArea(
            child: Container(
              height: 60,
              padding: EdgeInsets.fromLTRB(10, 0, 10, 10),
              child: BrandButtons.primaryBig(
                text: 'GO',
                onPressed: fullExpedition == null
                    ? null
                    : () async {
                        var res = await showDialog(
                          context: context,
                          builder: (context) => AlertDialog(
                            key: Key("location-warning-dialogue"),
                            title:
                                Text(LocaleKeys.expedition_warning_title.tr()),
                            content:
                                Text(LocaleKeys.expedition_warning_text.tr()),
                            actions: <Widget>[
                              TextButton(
                                  onPressed: () =>
                                      Navigator.of(context).pop(false),
                                  child: Text(LocaleKeys.basis_cancel.tr())),
                              TextButton(
                                onPressed: () =>
                                    Navigator.of(context).pop(true),
                                child: Text(LocaleKeys.basis_accept.tr()),
                              )
                            ],
                          ),
                        );

                        if (res) {
                          await context.read<LiveCubit>().set(fullExpedition);
                          Navigator.of(context).push(
                            noAnimationRoute(
                              ExpeditionLive(),
                            ),
                          );
                        }
                      },
              ),
            ),
          ),
          body: Padding(
            padding: EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                SizedBox(
                  height: 200,
                  child: fullExpedition == null
                      ? BrandLoader()
                      : StaticMap(route: fullExpedition.routes.first),
                ),
                SizedBox(height: 20),
                Text(
                  'Start date and time: ${format.format(widget.expedition.startDateTime)}',
                ),
                if (widget.expedition.description != null) ...[
                  Text(widget.expedition.description!),
                ],
                Text('Activity types'),
                if (actitvityTypes.isEmpty) Text('emtpy'),
                if (actitvityTypes.isNotEmpty)
                  ...actitvityTypes
                      .map((a) => Padding(
                            padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
                            child: Row(
                              children: [
                                Icon(
                                  Icons.check_box,
                                  color: BrandColors.mGrey,
                                ),
                                SizedBox(width: 10),
                                Text(a.name),
                              ],
                            ),
                          ))
                      .toList()
              ],
            ),
          ),
        );
      }),
    );
  }
}
