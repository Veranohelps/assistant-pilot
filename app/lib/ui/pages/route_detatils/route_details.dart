import 'package:app/config/theme_typo.dart';
import 'package:app/logic/cubits/dictionaries/dictionaries_cubit.dart';
import 'package:app/logic/cubits/route/route_cubit.dart';
import 'package:app/logic/model/route.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:cubit_form/cubit_form.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

final dateFormat = DateFormat.yMMMd();

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
    return Scaffold(
      appBar: AppBar(
        title: Text(route.name),
      ),
      body: BlocProvider(
        create: (_) => RouteCubit()..getRoute(route.url),
        child: Builder(
          builder: (context) {
            return BlocBuilder<RouteCubit, DersuRoute?>(
              builder: (_, route) {
                final dectionary = context.watch<DictionariesCubit>().state;

                if (route == null || dectionary is! DictionariesLoaded) {
                  return BrandLoading();
                }
                return ListView(
                  padding: EdgeInsets.all(10),
                  children: [
                    ...buildBlock('Origin', route.originId),
                    ...buildBlock(
                      'Origin description',
                      dectionary.findRouteById(route.originId).description,
                    ),
                    ...buildBlock('Name', route.name),
                    ...buildBlock('id', route.id),
                    ...buildBlock(
                        'updatedAt', dateFormat.format(route.updatedAt)),
                  ],
                );
              },
            );
          },
        ),
      ),
    );
  }

  List<Widget> buildBlock(String title, String value) {
    return [
      Text(title, style: ThemeTypo.h4),
      SizedBox(height: 5),
      Text(value, style: ThemeTypo.p0),
      SizedBox(height: 10),
    ];
  }
}
