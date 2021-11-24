import 'package:app/generated/locale_keys.g.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:app/config/get_it_config.dart';
import 'package:flutter/material.dart';
import 'package:dersu_permissions/dersu_permissions.dart';

class DersuPermissionsHandler {
  static Future<bool> requestPermission({bool showDialog = true}) async {
    DersuPermissionsStatus status = await DersuPermissions.requestPermissions();
    if (status == DersuPermissionsStatus.always) {
      return true;
    }

    if (status == DersuPermissionsStatus.denied && showDialog) {
      showPopupDialog(LocaleKeys.expedition_warning_title.tr(),
          LocaleKeys.expedition_warning_text.tr());
    } else if (status == DersuPermissionsStatus.authorizedWhenInUse &&
        showDialog) {
      showPopupDialog(LocaleKeys.expedition_warning_title.tr(),
          LocaleKeys.expedition_warning_text.tr());
    }
    return false;
  }

  static void showPopupDialog(String title, String content) {
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
}
