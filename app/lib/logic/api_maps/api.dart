import 'dart:async';

import 'package:app/main.dart';
import 'package:dio/dio.dart';

abstract class ApiMap {
  FutureOr<Dio> getClient();

  FutureOr<BaseOptions> get options;

  bool hasLoger = apiDefaultLog;

  ValidateStatus? validateStatus;

  void close(Dio client) {
    client.close();
    validateStatus = null;
  }
}
