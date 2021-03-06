import 'package:flutter/material.dart';
import 'package:modal_bottom_sheet/modal_bottom_sheet.dart';

Future<T?> showBrandBottomSheet<T>({
  required BuildContext context,
  required WidgetBuilder builder,
}) =>
    showCupertinoModalBottomSheet<T>(
      topRadius: const Radius.circular(30),
      builder: builder,
      barrierColor: Colors.black45,
      context: context,
      shadow: BoxShadow(color: Colors.transparent),
      backgroundColor: Colors.white,
    );
