// ignore_for_file: prefer_const_constructors

import 'package:app/logic/cubits/dictionaries/dictionaries_cubit.dart';
import 'package:app/logic/cubits/expedition/expedition_cubit.dart';
import 'package:app/logic/cubits/expeditions/expeditions_cubit.dart';
import 'package:app/logic/forms/expedition_form/expedition_form.dart';
import 'package:app/logic/models/expedition.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:app/ui/components/expedition_form/expedition_form.dart';
import 'package:cubit_form/cubit_form.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:easy_localization/easy_localization.dart';

var format = DateFormat.MMMMd().add_Hm();

class ExpeditionPage extends StatefulWidget {
  const ExpeditionPage({
    required this.expedition,
    required this.mode,
    Key? key,
  }) : super(key: key);

  final ExpeditionShort expedition;
  final ExpeditionFormMode mode;
  @override
  State<ExpeditionPage> createState() => _ExpeditionPageState();
}

class _ExpeditionPageState extends State<ExpeditionPage> {
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
        var dictionaries = context.watch<DictionariesCubit>().state;

        if (fullExpedition == null || dictionaries is! DictionariesLoaded) {
          return BrandLoader();
        }

        return BlocProvider<ExpeditionFormCubit>(
          create: (_) => ExpeditionFormCubit(
            initType: widget.mode,
            fullExpedition: fullExpedition,
            expeditionsCubit: context.read<ExpeditionsCubit>(),
          ),
          child: Builder(
            builder: (context) {
              var formCubit = context.read<ExpeditionFormCubit>();
              return ExpeditionForm(
                route: fullExpedition.routes.first,
                formCubit: formCubit,
              );
            },
          ),
        );
      }),
    );
  }
}
