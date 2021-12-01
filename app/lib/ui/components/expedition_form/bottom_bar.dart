part of 'expedition_form.dart';

class _BottomBar extends StatelessWidget {
  const _BottomBar({
    Key? key,
    required this.formCubit,
  }) : super(key: key);

  final ExpeditionFormCubit formCubit;

  @override
  Widget build(BuildContext context) {
    return CubitFormFieldsBuilder(
      fields: formCubit.fields,
      builder: (context, stateList) {
        var dateState = formCubit.date.state;
        var activity = formCubit.activityTypeIds.state;
        late String activityString;
        if (activity.value.isEmpty) {
          activityString = LocaleKeys.planning_not_selected.tr();
        } else {
          var dict =
              context.read<DictionariesCubit>().state as DictionariesLoaded;

          activityString = dict.findActiveTypeById(activity.value.first).name;
        }
        return Container(
          decoration: BoxDecoration(
            border: Border(top: BorderSide(color: BrandColors.dGray)),
          ),
          padding: EdgeInsets.fromLTRB(
              20, 20, 20, max(20, MediaQuery.of(context).padding.bottom + 10)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                  '${LocaleKeys.planning_expedition_date.tr()}: ${dateState.value == null ? LocaleKeys.planning_not_selected.tr() : dateFormat2.format(dateState.value!)}'),
              Row(
                children: [
                  Text(
                      '${LocaleKeys.planning_expedition_activity.tr()}: $activityString'),
                ],
              ),
              SizedBox(height: 10),
              actionButton(context),
            ],
          ),
        );
      },
    );
  }

  Widget actionButton(BuildContext context) {
    var type = formCubit.type.state.value;
    switch (type) {
      case ExpeditionFormMode.invitedGuest:
        return Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            BrandButtons.primaryBig(
              color: Colors.red,
              text: LocaleKeys.planning_reject_invite.tr(),
              onPressed: () async {
                context
                    .read<ExpeditionsCubit>()
                    .reject(formCubit.fullExpedition!.id);
                Navigator.of(context).pop();
              },
            ),
            SizedBox(width: 20),
            BrandButtons.primaryBig(
              text: LocaleKeys.planning_accept_invite.tr(),
              onPressed: () async {
                await context
                    .read<ExpeditionsCubit>()
                    .accept(formCubit.fullExpedition!.id);
                formCubit.type.setValue(ExpeditionFormMode.confirmedGuest);
              },
            ),
          ],
        );
      case ExpeditionFormMode.ownerPlanning:
        return BlocBuilder<ExpeditionFormCubit, FormCubitState>(
          bloc: formCubit,
          builder: (context, formState) {
            return BrandButtons.primaryBig(
              text: LocaleKeys.planning_confirm_expedition.tr(),
              onPressed: formState.isFormDataValid && !formState.isSubmitting
                  ? formCubit.trySubmit
                  : null,
            );
          },
        );
      case ExpeditionFormMode.ownerEditing:
        return Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            BrandButtons.primaryBig(
              color: Colors.red,
              text: LocaleKeys.basis_cancel.tr(),
              onPressed: () async {
                formCubit.reset();
                formCubit.type.setValue(ExpeditionFormMode.ownerShow);
              },
            ),
            SizedBox(width: 20),
            BlocBuilder<ExpeditionFormCubit, FormCubitState>(
              bloc: formCubit,
              builder: (context, formState) {
                return BrandButtons.primaryBig(
                  text: LocaleKeys.basis_save.tr(),
                  onPressed:
                      formState.isFormDataValid && !formState.isSubmitting
                          ? formCubit.trySubmit
                          : null,
                );
              },
            ),
          ],
        );

      case ExpeditionFormMode.confirmedGuest:
      case ExpeditionFormMode.ownerShow:
        return BrandButtons.primaryBig(
          text: LocaleKeys.planning_start_expedition.tr(),
          onPressed: () async {
            bool allowed = await DersuPermissionsHandler.requestPermission();
            if (allowed) {
              await context.read<LiveCubit>().set(formCubit.fullExpedition!);
              Navigator.of(context).push(
                noAnimationRoute(
                  ExpeditionLive(),
                ),
              );
            }
          },
        );
    }
  }
}
