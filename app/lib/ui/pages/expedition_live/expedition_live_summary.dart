import 'package:app/generated/locale_keys.g.dart';
import 'package:app/logic/cubits/expeditions/expeditions_cubit.dart';
import 'package:app/utils/extensions/duration.dart';
import 'package:flutter/material.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:provider/provider.dart';

class ExpeditionSummary extends StatelessWidget {
  const ExpeditionSummary({
    Key? key,
    required this.duration,
  }) : super(key: key);

  final Duration duration;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(LocaleKeys.expedition_summary_finished.tr()),
            Text(LocaleKeys.expedition_summary_duration.tr() +
                ': ' +
                duration.toDayHourMinuteSecondFormat()),
            SizedBox(height: 10),
            BrandButtons.primaryBig(
              onPressed: () async {
                await context.read<ExpeditionsCubit>().fetch();
                Navigator.popUntil(context, (route) => route.isFirst);
              },
              text: LocaleKeys.basis_ok.tr(),
            ),
          ],
        ),
      ),
    );
  }
}
