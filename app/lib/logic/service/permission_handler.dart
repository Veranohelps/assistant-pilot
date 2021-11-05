import 'package:app/config/get_it_config.dart';
import 'package:flutter/material.dart';
import 'package:dersu_permissions/dersu_permissions.dart';

class DersuPermissionsHandler {
  static Future<bool> requestPermission({bool showDialog = true}) async {
    DersuPermissionsStatus status = await DersuPermissions.requestPermissions();
    print(status);
    if (status == DersuPermissionsStatus.always) {
      return true;
    }

    if (status == DersuPermissionsStatus.denied && showDialog) {
      showPopupDialog('Open settings',
          'Dersu app needs location permission to be always denied status');
    } else if (status == DersuPermissionsStatus.authorizedWhenInUse &&
        showDialog) {
      showPopupDialog('Open settings',
          'Dersu app needs location permission to be always authorized_when_in_use status');
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
              child: Text('Open')),
          ElevatedButton(
              onPressed: () {
                getIt<NavigationService>().navigator.pop();
              },
              child: Text('Cancel')),
        ],
      ),
    );
  }
}
