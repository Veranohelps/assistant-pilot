import 'dart:io';

import 'package:app/logic/cubits/profile/user_routes_cubit.dart';
import 'package:app/logic/forms/upload_gpx/upload_gpx_form.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:cubit_form/cubit_form.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:easy_localization/easy_localization.dart';

class AddUserGpx extends StatefulWidget {
  const AddUserGpx({required this.userRoutesCubit, Key? key}) : super(key: key);

  final UserRoutesCubit userRoutesCubit;

  @override
  State<AddUserGpx> createState() => _AddUserGpx();
}

class _AddUserGpx extends State<AddUserGpx> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(LocaleKeys.profile_my_routes_import_gpx.tr())),
      body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: BlocProvider(
            create: (context) => UploadGpxFormCubit(),
            child: Builder(
              builder: (context) {
                final form = context.watch<UploadGpxFormCubit>();

                if (form.state.isSubmitting) {
                  return BrandLoader();
                }

                if (form.state.isSubmitted && !form.state.isErrorShown) {
                  return UploadSuccess(
                    cubit: widget.userRoutesCubit,
                    routeDetailCallback: null,
                    backToRouteListCallback: Navigator.of(context).pop,
                  );
                }

                if (!form.state.isFormDataValid && form.state.isErrorShown) {
                  return UploadError(
                    error: form.gpxFilePath.state.error!,
                    resetCallback: form.resetToInit,
                  );
                }

                return Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      BlocBuilder<FieldCubit, FieldCubitState>(
                          bloc: form.gpxFilePath,
                          builder: (_, state) {
                            return Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                Text(
                                  (state.value == '')
                                      ? LocaleKeys.profile_my_routes_upload_hint
                                          .tr()
                                      : LocaleKeys
                                              .profile_my_routes_upload_file_selected
                                              .tr() +
                                          ": ",
                                  style: TextStyle(fontWeight: FontWeight.bold),
                                ),
                                Text(state.value.split('/').last)
                              ],
                            );
                          }),
                      Spacer(),
                      BrandButtons.primaryBig(
                          text: LocaleKeys.basis_browse.tr(),
                          onPressed: () => selectGpxFile(form)),
                      BrandButtons.primaryBig(
                          text: LocaleKeys.basis_submit.tr(),
                          onPressed: form.state.isSubmitting ||
                                  !form.state.isFormDataValid
                              ? null
                              : () => form.trySubmit()),
                      SizedBox(
                        height: 10 + MediaQuery.of(context).padding.bottom,
                      ),
                    ],
                  ),
                );
              },
            ),
          )),
    );
  }

  void selectGpxFile(UploadGpxFormCubit form) async {
    FilePickerResult? result = await FilePicker.platform.pickFiles();
    if (result != null) {
      File file = File(result.files.first.path!);
      form.gpxFilePath.setValue(file.path);
    }
  }
}

class UploadSuccess extends StatelessWidget {
  const UploadSuccess(
      {required this.cubit,
      required this.backToRouteListCallback,
      required this.routeDetailCallback,
      Key? key})
      : super(key: key);

  final VoidCallback backToRouteListCallback;
  final VoidCallback? routeDetailCallback;
  final UserRoutesCubit cubit;

  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: Center(
                child: Text(
                  LocaleKeys.profile_my_routes_upload_success_title.tr(),
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            BrandButtons.primaryBig(
              text: LocaleKeys.profile_my_routes_upload_see_route.tr(),
              onPressed: () =>
                  (routeDetailCallback != null) ? routeDetailCallback!() : null,
            ),
            BrandButtons.primaryBig(
                text:
                    LocaleKeys.profile_my_routes_upload_back_to_route_list.tr(),
                onPressed: () {
                  cubit.reload();
                  backToRouteListCallback();
                }),
            SizedBox(height: 10 + MediaQuery.of(context).padding.bottom),
          ],
        ));
  }
}

class UploadError extends StatelessWidget {
  const UploadError(
      {required this.error, required this.resetCallback, Key? key})
      : super(key: key);

  final String error;
  final VoidCallback resetCallback;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        children: [
          Spacer(),
          Text(
            LocaleKeys.profile_my_routes_upload_error_title.tr(),
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 30),
          Text(
            LocaleKeys.profile_my_routes_upload_error_text.tr(),
          ),
          SizedBox(height: 30),
          Text(
            error,
            style: TextStyle(fontStyle: FontStyle.italic),
          ),
          SizedBox(height: 30),
          Spacer(),
          BrandButtons.primaryBig(
            text: LocaleKeys.basis_ok.tr(),
            onPressed: () => resetCallback(),
          ),
          SizedBox(height: 10 + MediaQuery.of(context).padding.bottom),
        ],
      ),
    );
  }
}
