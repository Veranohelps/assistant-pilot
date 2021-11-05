// ignore_for_file: prefer_const_constructors

import 'package:app/config/brand_colors.dart';
import 'package:app/config/theme_typo.dart';
import 'package:app/logic/cubits/dictionaries/dictionaries_cubit.dart';
import 'package:app/logic/cubits/route/route_cubit.dart';
import 'package:app/logic/cubits/select_activity_types/select_activity_types_cubit.dart';
import 'package:app/logic/cubits/select_time/select_time.dart';
import 'package:app/logic/cubits/weather/weather_cubit.dart';
import 'package:app/logic/models/route.dart';
import 'package:app/logic/models/time_with_timezone.dart';
import 'package:app/logic/models/weather/range_forecast.dart';
import 'package:app/ui/components/brand_divider/brand_divider.dart';
import 'package:app/ui/components/brand_fake_input/brand_fake_input.dart';
import 'package:app/ui/components/brand_icons/dersu_icons_icons.dart';
import 'package:app/ui/components/brand_label/brand_raw_label.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:app/ui/components/maps/static_map.dart';
import 'package:app/ui/pages/create_planning/create_planning.dart';
import 'package:app/ui/pages/image_viewer/image_viewer.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:cubit_form/cubit_form.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:provider/provider.dart';
import 'package:app/utils/extensions/extensions.dart';
import 'dart:async' show StreamSubscription;
import 'package:async/async.dart' show StreamGroup;

part 'ruta.dart';
part 'condiciones.dart';
part 'helpers.dart';
part 'terreno.dart';

final dateFormat2 = DateFormat.yMMMMd().add_jm();
final dataFormat1 = DateFormat('dd/MM/yy');
final weekDay = DateFormat.EEEE();

final hhMMFormat = DateFormat.jm();

class RouteDetails extends StatelessWidget {
  const RouteDetails({
    Key? key,
    required this.route,
  }) : super(key: key);

  final DersuRouteShort route;

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => RouteCubit()..getRoute(route.url),
      child: DefaultTabController(
        length: 4,
        child: Scaffold(
          appBar: AppBar(
            title: Text('GUARDAR'),
            bottom: PreferredSize(
              preferredSize: Size.fromHeight(50),
              child: Container(
                padding: EdgeInsets.only(left: 48),
                child: TabBar(
                  indicatorColor: BrandColors.active,
                  isScrollable: true,
                  labelStyle: ThemeTypo.martaTab,
                  tabs: [
                    Tab(text: 'Ruta'.toUpperCase()),
                    Tab(text: 'Condiciones'.toUpperCase()),
                    Tab(text: 'Terreno'.toUpperCase()),
                    Tab(text: 'Grupo'.toUpperCase()),
                  ],
                ),
              ),
            ),
          ),
          body: TabBarView(
            physics: NeverScrollableScrollPhysics(),
            children: [
              RutaTab(),
              CondicionesTab(routeId: route.id),
              TerrenoTab(),
              Center(child: Text('Grupo')),
            ],
          ),
        ),
      ),
    );
  }
}
