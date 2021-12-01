// ignore_for_file: prefer_const_constructors

import 'package:app/logic/forms/expedition_form/expedition_form.dart';
import 'package:app/logic/cubits/dictionaries/dictionaries_cubit.dart';
import 'package:app/logic/cubits/route/route_cubit.dart';
import 'package:app/logic/models/route.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:app/ui/components/expedition_form/expedition_form.dart';
import 'package:cubit_form/cubit_form.dart';
import 'package:flutter/material.dart';

class RouteDetails extends StatefulWidget {
  const RouteDetails({
    Key? key,
    required this.route,
    required this.formCubit,
  }) : super(key: key);

  final DersuRouteShort route;
  final ExpeditionFormCubit formCubit;

  @override
  State<RouteDetails> createState() => _RouteDetailsState();
}

class _RouteDetailsState extends State<RouteDetails> {
  bool isExpeditionFormCubitReady = false;

  @override
  Widget build(BuildContext context) {
    return BlocProvider<RouteCubit>(
      create: (_) => RouteCubit()..getRoute(widget.route.url),
      child: Builder(builder: (context) {
        var dictionaries = context.watch<DictionariesCubit>().state;
        var isWidgetReady =
            isExpeditionFormCubitReady && dictionaries is DictionariesLoaded;

        return BlocConsumer<RouteCubit, DersuRouteFull?>(
            listener: (context, state) {
          widget.formCubit.changeRoute(state!);
          setState(() {
            isExpeditionFormCubitReady = true;
          });
        }, builder: (_, route) {
          return isWidgetReady
              ? ExpeditionForm(
                  route: route!,
                  formCubit: widget.formCubit,
                )
              : BrandLoader();
        });
      }),
    );
  }
}
