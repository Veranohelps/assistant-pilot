import 'dart:async';

import 'package:connectivity/connectivity.dart';
import 'package:flutter/material.dart';

class ConnectivityService extends ChangeNotifier {
  late ConnectivityResult status;
  late StreamSubscription subscription;

  Future<void> init() async {
    check();
    subscription = Connectivity()
        .onConnectivityChanged
        .listen((ConnectivityResult result) {
      status = result;
    });
  }

  Future<void> check() async {
    status = await Connectivity().checkConnectivity();
  }

  Future<void> close() async {
    await subscription.cancel();
  }
}
