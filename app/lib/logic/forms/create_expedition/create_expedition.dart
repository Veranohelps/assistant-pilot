import 'dart:async';
import 'package:app/logic/cubits/expeditions/expeditions_cubit.dart';
import 'package:app/logic/forms/expedition_form/expedition_form.dart';
import 'package:cubit_form/cubit_form.dart';

import 'dto/create_expedition.dart';
import 'dto/route_time.dart';

class CreateExpeditionFormCubit extends FormCubit {
  CreateExpeditionFormCubit({
    required this.expeditionFormCubit,
    required this.expeditionsCubit,
  }) {
    name = FieldCubit(
      initalValue: '',
      validations: [
        RequiredStringValidation('Required'),
      ],
    );

    descrption = FieldCubit(
      initalValue: '',
    );

    addFields([name, descrption]);
  }

  final ExpeditionFormCubit expeditionFormCubit;
  final ExpeditionsCubit expeditionsCubit;

  late FieldCubit<String> name;
  late FieldCubit<String> descrption;

  @override
  FutureOr<void> onSubmit() async {
    var formActivityTypeIds = expeditionFormCubit.activityTypeIds.state.value;
    var route = expeditionFormCubit.route.state.value!;
    var startTime = expeditionFormCubit.date.state.value!;
    var invites =
        expeditionFormCubit.users.state.value.map((u) => u.id).toList();

    var types = formActivityTypeIds
        .where((element) => route.activityTypeIds.contains(element))
        .toList();

    var expeditionData = ExpeditionDto(
      name: name.state.value,
      description:
          descrption.state.value.isNotEmpty ? descrption.state.value : null,
      activityTypes: types,
      routes: [
        RouteWithStartTimeDto(
          routeId: route.id,
          startDateTime: startTime,
        ),
      ],
      invites: invites,
    );

    expeditionsCubit.create(expeditionData);
    expeditionFormCubit.reset();
  }
}
