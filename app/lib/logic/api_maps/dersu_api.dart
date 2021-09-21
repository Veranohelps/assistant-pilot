import 'package:app/config/get_it_config.dart';
import 'package:app/logic/get_it/auth_token.dart';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_config/flutter_config.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';

import 'api.dart';

abstract class PrivateDersuApi extends ApiMap {
  Future<Dio> getClient() async {
    var dio = Dio(await options);
    if (hasLoger) {
      dio.interceptors.add(PrettyDioLogger(
        requestHeader: true,
        requestBody: true,
        responseBody: true,
        responseHeader: false,
        error: true,
        compact: true,
        maxWidth: 90,
      ));
    }

    return dio;
  }

  @protected
  Future<BaseOptions> get options async {
    var authToken = getIt<AuthTokenService>();
    assert(authToken.hasToken, 'no auth token');
    return BaseOptions(
      baseUrl: FlutterConfig.get('DERSU_API_BASE_URL'),
      headers: {"Authorization": 'Bearer ${authToken.idToken}'},
    );
  }
}
