import 'dart:async';

import 'package:app/logic/api_maps/user_api.dart';
import 'package:cubit_form/cubit_form.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:easy_localization/easy_localization.dart';

class UploadGpxFormCubit extends FormCubit {
  UploadGpxFormCubit() {
    gpxFilePath = FieldCubit(
      initalValue: '',
      validations: [
        RequiredStringValidation(LocaleKeys.basis_required.tr()),
      ],
    );

    addFields([gpxFilePath]);
  }

  @override
  asyncValidation() async {
    var response = await api.uploadGpxFile(gpxFilePath.state.value);
    return response.fold((error) {
      gpxFilePath.setError(error.message);
      return false;
    }, (_) {
      return true;
    });
  }

  @override
  FutureOr<void> onSubmit() async {}

  late FieldCubit<String> gpxFilePath;
  final api = UserApi();

  void resetToInit() {
    emit(FormCubitState(
      isInitial: true,
      isErrorShown: false,
      isFormDataValid: false,
      isSubmitted: false,
      isSubmitting: false,
    ));
  }
}
