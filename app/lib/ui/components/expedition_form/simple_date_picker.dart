part of 'expedition_form.dart';

class _SimpleDatePicker extends StatelessWidget {
  const _SimpleDatePicker({
    Key? key,
    required this.date,
    required this.formCubit,
  }) : super(key: key);

  final FieldCubit<DateTime?> date;
  final ExpeditionFormCubit formCubit;
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<FieldCubit<DateTime?>, FieldCubitState<DateTime?>>(
      bloc: date,
      builder: (context, state) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            BrandRawLabel(
              isEmpty: state.value == null,
              isDisabled: false,
              isRequired: true,
              text: LocaleKeys.planning_conditions_date_time_departure.tr(),
            ),
            Row(
              children: [
                Expanded(
                  child: BrandFakeInput(
                    hasError: false,
                    intputText: state.value == null
                        ? LocaleKeys.planning_conditions_select.tr()
                        : dateFormat2.format(state.value!),
                    onPress: () => setTimeFilterDate(context, formCubit),
                  ),
                ),
                SizedBox(width: 5),
                IconButton(
                  onPressed: () => setTimeFilterDate(context, formCubit),
                  icon: Icon(Icons.edit),
                )
              ],
            ),
          ],
        );
      },
    );
  }
}
