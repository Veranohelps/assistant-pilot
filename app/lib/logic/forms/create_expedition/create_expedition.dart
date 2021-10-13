import 'dart:async';

import 'package:app/logic/api_maps/expeditions.dart';
import 'package:app/logic/cubits/dashboard/dashboard_cubit.dart';
import 'package:app/logic/cubits/time_filter/time_filter_cubit.dart';
import 'package:cubit_form/cubit_form.dart';
import 'package:app/logic/models/dto/create_expedition.dart';
import 'package:app/logic/models/dto/route_time.dart';

class CreateExpeditionFormCubit extends FormCubit {
  CreateExpeditionFormCubit({
    required this.startTime,
    required this.routeId,
    required this.dashboardCubit,
    required this.timeFilterCubit,
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
  final String routeId;
  final DashboardCubit dashboardCubit;
  final TimeFilterCubit timeFilterCubit;

  late FieldCubit<String> name;
  late FieldCubit<String> descrption;

  @override
  FutureOr<void> onSubmit() async {
    var expeditionData = CreateExpeditionDto(
        name: name.state.value,
        description:
            descrption.state.value.isNotEmpty ? descrption.state.value : null,
        routes: [
          RouteWithStartTimeDto(
            routeId: routeId,
            startDateTime: startTime,
          ),
        ]);

    await api.create(expeditionData);
    await dashboardCubit.fetch();
    timeFilterCubit.resetTime();
  }
}
