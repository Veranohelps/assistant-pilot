import 'package:app/config/brand_theme.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:app/logic/cubits/expeditions/expeditions_cubit.dart';
import 'package:app/logic/model/expedition.dart';
import 'package:app/ui/components/brand_card/brand_card.dart';
import 'package:app/ui/components/loader/loader.dart';
import 'package:app/ui/pages/expedition_details/expedition_details.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:flutter/material.dart';
import 'package:app/utils/extensions/text_extension.dart';
import 'package:easy_localization/easy_localization.dart';

class ExpeditionsDetails extends StatelessWidget {
  const ExpeditionsDetails({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var expeditionsState = context.watch<ExpeditionsCubit>().state;

    if (expeditionsState is! ExpeditionsLoaded) {
      return Loader();
    }
    return ExpeditionListScreen(
      expeditions: expeditionsState.list,
    );
  }
}

class ExpeditionListScreen extends StatelessWidget {
  final List<Expedition> expeditions;

  ExpeditionListScreen({
    required this.expeditions,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(LocaleKeys.plans_name.tr())),
      body: ListView(
        padding: paddingH25V0.copyWith(top: 20),
        children: [
          Text(LocaleKeys.expeditions.tr()),
          for (var expedition in expeditions)
            GestureDetector(
              onTap: () {
                Navigator.of(context).push(
                  materialRoute(
                    ExpeditionDetails(
                      expedition: expedition,
                    ),
                    expedition.name,
                  ),
                );
              },
              child: BrandCard(
                child: Text(expedition.name).h3,
              ),
            ),
        ],
      ),
    );
  }
}
