import 'package:app/config/brand_colors.dart';
import 'package:app/config/theme_typo.dart';
import 'package:app/logic/cubits/dictionaries/dictionaries_cubit.dart';
import 'package:app/logic/cubits/route/route_cubit.dart';
import 'package:app/logic/cubits/time_filter/time_filter_cubit.dart';
import 'package:app/logic/cubits/weather/weather_cubit.dart';
import 'package:app/logic/models/route.dart';
import 'package:app/logic/models/weather/hourly_forecast.dart';
import 'package:app/ui/components/brand_fake_input/brand_fake_input.dart';
import 'package:app/ui/components/brand_icons/dersu_icons_icons.dart';
import 'package:app/ui/components/brand_label/brand_raw_label.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:app/ui/components/maps/static_map.dart';
import 'package:app/ui/pages/create_planning/create_planning.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:cubit_form/cubit_form.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:provider/provider.dart';
import 'package:app/utils/extensions/extensions.dart';

part 'ruta.dart';
part 'condiciones.dart';

final dateFormat2 = DateFormat.yMMMMd().add_jm();
final dataFormat1 = DateFormat('dd/MM/yy');
final weekDay = DateFormat.EEEE();

final hhMMFormat = DateFormat.jm();

class RouteDetails extends StatelessWidget {
  const RouteDetails({
    Key? key,
    required this.route,
    this.isLife = false,
  }) : super(key: key);

  final DersuRouteShort route;
  final bool isLife;

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
              CondicionesTab(),
              Center(child: Text('Terreno')),
              Center(child: Text('Grupo')),
            ],
          ),
        ),
      ),
    );
  }
}
