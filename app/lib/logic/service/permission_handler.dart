import 'package:app/generated/locale_keys.g.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:app/config/get_it_config.dart';
import 'package:flutter/material.dart';
import 'package:dersu_permissions/dersu_permissions.dart';

class DersuPermissionsHandler {
  static Future<bool> requestPermission({required bool showDialog}) async {
    if (showDialog) {
      await showLocationWarning();
    }

    DersuPermissionsStatus status = await DersuPermissions.requestPermissions();

    if (status == DersuPermissionsStatus.always) {
      return true;
    }

    // show error for status == denied, authorizedWhenInUse, error
    showCantProceedError();
    return false;
  }

  static void showCantProceedError() {
    var title = LocaleKeys.expedition_location_access_error_title.tr();
    var content = LocaleKeys.expedition_location_access_error_text.tr();

    getIt<NavigationService>().showPopUpDialog(
      AlertDialog(
        title: Text(title),
        content: Text(content),
        actions: [
          ElevatedButton(
              onPressed: () {
                DersuPermissions.openSettings();
                getIt<NavigationService>().navigator.pop();
              },
              child: Text(LocaleKeys.basis_open_settings.tr())),
          ElevatedButton(
              onPressed: () {
                getIt<NavigationService>().navigator.pop();
              },
              child: Text(LocaleKeys.basis_cancel.tr())),
        ],
      ),
    );
  }

  static Future<void> showLocationWarning() async {
    var title = LocaleKeys.expedition_location_access_warning_title.tr();
    var content = LocaleKeys.expedition_location_access_warning_text.tr();

    return await getIt<NavigationService>().showPopUpDialog(
      AlertDialog(
        title: Text(title),
        content: Text(content),
        actions: [
          ElevatedButton(
              onPressed: () {
                getIt<NavigationService>().navigator.pop();
              },
              child: Text(LocaleKeys.basis_ok.tr())),
        ],
      ),
    );
  }
}
