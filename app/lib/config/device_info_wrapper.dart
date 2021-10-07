import 'package:app/config/get_it_config.dart';
import 'package:app/logic/get_it/device_info.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';

class DeviceInfoWrapper extends StatelessWidget {
  const DeviceInfoWrapper({
    Key? key,
    required this.child,
  }) : super(key: key);

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (_, constraints) {
        getIt<DeviceInfoService>().init(
          constraints.maxHeight,
          constraints.maxWidth,
        );
        getIt<DeviceInfoService>().setLocale(context.locale);
        return child;
      },
    );
  }
}
