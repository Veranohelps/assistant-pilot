import 'dart:async';

import 'package:app/logic/api_maps/expeditions.dart';
import 'package:app/logic/cubits/dashboard/dashboard_cubit.dart';
import 'package:app/logic/cubits/select_activity_types/select_activity_types_cubit.dart';
import 'package:app/logic/cubits/select_time/select_time.dart';
import 'package:app/logic/models/route.dart';
import 'package:cubit_form/cubit_form.dart';

import 'dto/create_expedition.dart';
import 'dto/route_time.dart';

class CreateExpeditionFormCubit extends FormCubit {
  CreateExpeditionFormCubit({
    required this.startTime,
    required this.route,
    required this.dashboardCubit,
    required this.selectTimeCubit,
    required this.selectActivityTypesCubit,
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

  final api = ExpeditionsApi();
  final DateTime startTime;
  final DersuRouteFull route;
  final DashboardCubit dashboardCubit;
  final SelectTimeCubit selectTimeCubit;
  final SelectActivityTypesCubit selectActivityTypesCubit;

  late FieldCubit<String> name;
  late FieldCubit<String> descrption;

  @override
  FutureOr<void> onSubmit() async {
    var types = selectActivityTypesCubit.state
        .where((element) => route.activityTypeIds.contains(element))
        .toList();

    var expeditionData = CreateExpeditionDto(
        name: name.state.value,
        description:
            descrption.state.value.isNotEmpty ? descrption.state.value : null,
        activityTypes: types,
        routes: [
          RouteWithStartTimeDto(
            routeId: route.id,
            startDateTime: startTime,
          ),
        ]);

    await api.create(expeditionData);
    await dashboardCubit.fetch();
    selectTimeCubit.resetTime();
    selectActivityTypesCubit.resetTypes();
  }
}
