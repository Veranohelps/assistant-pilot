import 'dart:async';

import 'package:app/logic/api_maps/routes.dart';
import 'package:app/logic/cubits/routes/route_search_cubit.dart';
import 'package:cubit_form/cubit_form.dart';

class RoutesSearchForm extends FormCubit {
  RoutesSearchForm({required this.routeSearchCubit}) {
    textField = FieldCubit(
      initalValue: '',
    );
    addFields([textField]);
  }

  late FieldCubit<String> textField;
  final RouteSearchCubit routeSearchCubit;

  @override
  FutureOr<void> onSubmit() async {
    routeSearchCubit.search(RouteSearchParameters(text: textField.state.value));
  }

  @override
  void reset() {
    routeSearchCubit.reset();
    super.reset();
  }
}
