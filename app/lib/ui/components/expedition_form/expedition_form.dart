import 'dart:math';

import 'package:app/generated/locale_keys.g.dart';
import 'package:app/logic/cubits/expeditions/expeditions_cubit.dart';
import 'package:app/logic/cubits/live/live_cubit.dart';
import 'package:app/logic/cubits/user_search/user_search_cubit.dart';
import 'package:app/logic/forms/expedition_form/expedition_form.dart';
import 'package:app/logic/models/activity_type.dart';
import 'package:app/logic/models/weather/hourly_forecast.dart';
import 'package:app/logic/models/weather/meteogram.dart';
import 'package:app/logic/cubits/profile/profile_cubit.dart';
import 'package:app/logic/models/profile.dart';
import 'package:app/logic/service/permission_handler.dart';
import 'package:app/ui/components/altitude_chart/altitude_chart.dart';
import 'package:app/config/brand_colors.dart';
import 'package:app/config/theme_typo.dart';
import 'package:app/logic/cubits/dictionaries/dictionaries_cubit.dart';
import 'package:app/logic/cubits/weather/weather_cubit.dart';
import 'package:app/logic/models/route.dart';
import 'package:app/logic/models/time_with_timezone.dart';
import 'package:app/logic/models/weather/range_forecast.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:app/ui/components/brand_divider/brand_divider.dart';
import 'package:app/ui/components/brand_fake_input/brand_fake_input.dart';
import 'package:app/ui/components/brand_icons/dersu_icons_icons.dart';
import 'package:app/ui/components/brand_label/brand_raw_label.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:app/ui/components/brand_text_field/brand_text_field.dart';
import 'package:app/ui/components/static_map/static_map.dart';
import 'package:app/ui/pages/expedition_live/expedition_live.dart';
import 'package:app/ui/pages/image_viewer/image_viewer.dart';
import 'package:app/ui/pages/root_tabs/profile/pages/levels.dart';
import 'package:app/utils/levels.dart';
import 'package:app/utils/named_font_weight.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:cubit_form/cubit_form.dart';
import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:app/utils/extensions/extensions.dart';
import 'dart:async' show StreamSubscription;
import 'package:async/async.dart' show StreamGroup;
import 'package:time_picker_widget/time_picker_widget.dart';
import 'package:flutter/services.dart' show rootBundle;

part 'route_tab.dart';
part 'condiciones_tab.dart';
part 'helpers.dart';
part 'terreno_tab.dart';
part 'simple_date_picker.dart';
part 'bottom_bar.dart';
part 'search_page.dart';
part 'group_tab.dart';

final dateFormat2 = DateFormat.yMMMMd().add_jm();
final dataFormat1 = DateFormat('dd/MM/yy');
final weekDay = DateFormat.EEEE();

final hhMMFormat = DateFormat.jm();

class ExpeditionForm extends StatefulWidget {
  const ExpeditionForm({
    Key? key,
    required this.route,
    required this.formCubit,
  }) : super(key: key);

  final DersuRouteFull route;
  final ExpeditionFormCubit formCubit;

  @override
  State<ExpeditionForm> createState() => _ExpeditionFormState();
}

class _ExpeditionFormState extends State<ExpeditionForm> {
  bool isExpeditionFormCubitReady = false;
  bool isGroupTab = false;

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (_) => WeatherCubit()..fetchWeather(widget.route.id),
        ),
      ],
      child: Builder(builder: (context) {
        return BlocBuilder<FieldCubit<ExpeditionFormMode>, FieldCubitState>(
          buildWhen: (previous, current) => previous.value != current.value,
          bloc: widget.formCubit.type,
          builder: (context, typeState) {
            final isEditable =
                typeState.value == ExpeditionFormMode.ownerEditing ||
                    typeState.value == ExpeditionFormMode.ownerPlanning;
            return DefaultTabController(
              length: 4,
              child: Scaffold(
                appBar: AppBar(
                  title: Text(widget.route.name),
                  actions: buildActionMenu(context),
                  bottom: PreferredSize(
                    preferredSize: Size.fromHeight(50),
                    child: Container(
                      padding: EdgeInsets.only(left: 48),
                      child: TabBar(
                        indicatorColor: BrandColors.active,
                        isScrollable: true,
                        labelStyle: ThemeTypo.martaTab,
                        onTap: (index) {
                          if (index == 3 && !isGroupTab) {
                            setState(() {
                              isGroupTab = true;
                            });
                          } else if (index != 3 && isGroupTab) {
                            setState(() {
                              isGroupTab = false;
                            });
                          }
                        },
                        tabs: [
                          Tab(
                              text: LocaleKeys.planning_tabs_route
                                  .tr()
                                  .toUpperCase()),
                          Tab(
                              text: LocaleKeys.planning_tabs_conditions
                                  .tr()
                                  .toUpperCase()),
                          Tab(
                              text: LocaleKeys.planning_tabs_terrain
                                  .tr()
                                  .toUpperCase()),
                          Tab(
                              text: LocaleKeys.planning_tabs_group
                                  .tr()
                                  .toUpperCase()),
                        ],
                      ),
                    ),
                  ),
                ),
                body: TabBarView(
                  physics: NeverScrollableScrollPhysics(),
                  children: [
                    RutaTab(
                      formCubit: widget.formCubit,
                    ),
                    CondicionesTab(
                      routeId: widget.route.id,
                      formCubit: widget.formCubit,
                      isEditable: isEditable,
                    ),
                    TerrenoTab(
                      formCubit: widget.formCubit,
                      isEditable: isEditable,
                    ),
                    GroupTab(
                      formCubit: widget.formCubit,
                      isEditable: isEditable,
                    ),
                  ],
                ),
                bottomNavigationBar: _BottomBar(
                  formCubit: widget.formCubit,
                ),
                floatingActionButton: isGroupTab && isEditable
                    ? Padding(
                        padding: const EdgeInsets.only(bottom: 0),
                        child: FloatingActionButton(
                          shape: StadiumBorder(),
                          onPressed: () {
                            Navigator.of(context).push(
                              materialRoute(
                                SearchPage(
                                  formCubit: widget.formCubit,
                                ),
                              ),
                            );
                          },
                          backgroundColor: Colors.redAccent,
                          child: Icon(
                            Icons.person_add_alt_1,
                            size: 20.0,
                          ),
                        ),
                      )
                    : null,
              ),
            );
          },
        );
      }),
    );
  }

  List<Widget>? buildActionMenu(BuildContext context) {
    switch (widget.formCubit.type.state.value) {
      case ExpeditionFormMode.confirmedGuest:
        return <Widget>[
          PopupMenuButton<int>(
            icon: Icon(Icons.more_vert),
            onSelected: (_) async {
              context
                  .read<ExpeditionsCubit>()
                  .leave(widget.formCubit.fullExpedition!.id);
              Navigator.of(context).pop();
            },
            itemBuilder: (_) => [
              PopupMenuItem<int>(
                value: 0,
                child: Text(LocaleKeys.planning_leave_expedition.tr()),
              ),
            ],
          ),
        ];

      case ExpeditionFormMode.ownerShow:
        return <Widget>[
          PopupMenuButton<int>(
            icon: Icon(Icons.more_vert),
            onSelected: (_) {
              widget.formCubit.type.setValue(ExpeditionFormMode.ownerEditing);
            },
            itemBuilder: (_) => [
              PopupMenuItem<int>(
                value: 0,
                child: Text(LocaleKeys.planning_edit_expedition.tr()),
              ),
            ],
          ),
        ];
      default:
    }
  }
}
