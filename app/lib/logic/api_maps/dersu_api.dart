import 'package:app/config/get_it_config.dart';
import 'package:app/logic/get_it/auth_token.dart';
import 'package:app/utils/debug.dart';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_config/flutter_config.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';

import 'api.dart';

abstract class PrivateDersuApi extends ApiMap {
  @override
  Future<Dio> getClient() async {
    var dio = Dio(await options);
    if (hasLoger) {
      dio.interceptors.add(PrettyDioLogger(
        request: true,
        requestHeader: true,
        requestBody: true,
        responseBody: true,
        responseHeader: false,
        compact: true,
        maxWidth: 90,
      ));
    }
    if (Application.isInDebugMode) {
      dio.interceptors.add(
        InterceptorsWrapper(
          onError: (DioError e, handler) {
            print(e.requestOptions.path);
            print(e.requestOptions.data);

            print(e.message);
            print(e.response);

            // return handler.next(e);
          },
        ),
      );
    }
    return dio;
  }

  @override
  @protected
  Future<BaseOptions> get options async {
    final authToken = getIt<AuthTokenService>();

    assert(authToken.hasToken, 'no auth token');

    final deviceInfo = getIt<DeviceInfoService>();

    return BaseOptions(
      baseUrl: FlutterConfig.get('DERSU_API_BASE_URL'),
      headers: {
        "Authorization": 'Bearer ${authToken.accessToken}',
        'x-dersu-language': deviceInfo.locale?.toString(),
        'x-dersu-region': 'xxx',
        'x-dersu-client-info': deviceInfo.deviceInfoString(),
      },
    );
  }
}
