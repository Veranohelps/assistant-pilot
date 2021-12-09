import 'dart:async';

import 'package:app/config/get_it_config.dart';
import 'package:app/logic/cubits/expeditions/expeditions_cubit.dart';
import 'package:app/logic/forms/create_expedition/dto/create_expedition.dart';
import 'package:app/logic/forms/create_expedition/dto/route_time.dart';
import 'package:app/logic/models/expedition.dart';
import 'package:app/logic/models/profile.dart';
import 'package:app/logic/models/route.dart';
import 'package:app/logic/models/time_with_timezone.dart';
import 'package:app/ui/components/expedition_form/create_planning.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:cubit_form/cubit_form.dart';

class ExpeditionFormCubit extends FormCubit {
  ExpeditionFormCubit({
    required ExpeditionFormMode initType,
    required this.expeditionsCubit,
    this.fullExpedition,
  }) {
    date = FieldCubit(
      initalValue: fullExpedition?.timeWithTimeZone,
      validations: [RequiredNotNullValidation('date required')],
    );

    activityTypeIds = FieldCubit(
      initalValue: fullExpedition?.activityTypeIds ?? const <String>[],
      validations: [
        ValidationModel(
          (l) => l.isEmpty,
          'cannot be empty',
        ),
      ],
    );

    users = FieldCubit(
      initalValue: fullExpedition?.users
              .where((u) =>
                  u.inviteStatus != InviteStatus.rejected &&
                  u.inviteStatus != InviteStatus.left)
              .toList() ??
          const <User>[],
      validations: [],
    );

    route = FieldCubit(
      initalValue: fullExpedition?.routes.first,
      validations: [RequiredNotNullValidation('route required')],
    );

    type = FieldCubit(
      initalValue: initType,
      validations: [],
    );
    addFields([date, activityTypeIds, users, type]);
  }
  @override
  FutureOr<void> onSubmit() async {
    assert(type.state.value == ExpeditionFormMode.ownerEditing ||
        type.state.value == ExpeditionFormMode.ownerPlanning);

    if (type.state.value == ExpeditionFormMode.ownerPlanning) {
      final navigator = getIt<NavigationService>().navigator;
      navigator.push(
        materialRoute(
          CreatePlanning(formCubit: this),
        ),
      );
    } else if (type.state.value == ExpeditionFormMode.ownerEditing) {
      var hiddenIds = fullExpedition!.users
          .where((u) =>
              u.inviteStatus == InviteStatus.rejected ||
              u.inviteStatus == InviteStatus.left)
          .map((u) => u.id)
          .toList();
      var visibleOldIds =
          users.state.value.whereType<GroupUser>().map((u) => u.id).toList();
      var newInvites = users.state.value
          .where((u) => u is! GroupUser)
          .map((u) => u.id)
          .toList();
      var expeditionData = ExpeditionDto(
        name: fullExpedition!.name,
        description: fullExpedition!.description,
        activityTypes: activityTypeIds.state.value,
        routes: [
          RouteWithStartTimeDto(
            routeId: route.state.value!.id,
            startDateTime: date.state.value!,
          ),
        ],
        users: [...visibleOldIds, ...hiddenIds],
        invites: newInvites,
      );
      expeditionsCubit.update(fullExpedition!.id, expeditionData);
      getIt<NavigationService>().navigator.pop();
    }
  }

  ExpeditionFull? fullExpedition;

  final ExpeditionsCubit expeditionsCubit;
  late FieldCubit<TimeWithTimeZone?> date;
  late FieldCubit<List<String>> activityTypeIds;
  late FieldCubit<List<User>> users;
  late FieldCubit<DersuRouteFull?> route;

  Future<void> changeRoute(DersuRouteFull newRoute) async {
    if (newRoute == route.state.value) {
      return;
    }
    route.setValue(newRoute);
    var tommorow = DateTime.now().add(Duration(days: 1));
    date.setValue(TimeWithTimeZone(
      newRoute.timezone.offset,
      tommorow.year,
      tommorow.month,
      tommorow.day,
      8,
    ));

    // only untill we have one activityType;
    if (activityTypeIds.state.value.isNotEmpty &&
        newRoute.activityTypeIds.contains(activityTypeIds.state.value.first)) {
      activityTypeIds.setValue([]);
    }

    await route.stream.firstWhere((event) => event.value == newRoute);
  }

  late FieldCubit<ExpeditionFormMode> type;
}

enum ExpeditionFormMode {
  invitedGuest,
  confirmedGuest,
  ownerPlanning,
  ownerEditing,
  ownerShow
}
