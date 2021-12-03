import 'dart:io';

import 'package:app/config/get_it_config.dart';
import 'package:app/logic/cubits/authentication/repository.dart';
import 'package:app/logic/get_it/auth_token.dart';
import 'package:app/ui/pages/errors/wrong_token.dart';
import 'package:app/utils/debug.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_config/flutter_config.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';

import 'api.dart';

abstract class PrivateDersuApi extends ApiMap {
  bool isFirstTry = true;

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

            return handler.next(e);
          },
        ),
      );
    }

    dio.interceptors.add(
      InterceptorsWrapper(
        onError: (err, handler) async {
          print('InterceptorsWrapper');

          if (err.response?.statusCode == HttpStatus.unauthorized) {
            if (isFirstTry) {
              isFirstTry = false;

              var authToken = (await AuthenticationRepository().refreshToken());
              err.requestOptions.headers["Authorization"] =
                  'Bearer ${authToken.accessToken}';
              final opts = Options(
                method: err.requestOptions.method,
                headers: err.requestOptions.headers,
              );
              final cloneReq = await dio.request(
                err.requestOptions.path,
                options: opts,
                data: err.requestOptions.data,
                queryParameters: err.requestOptions.queryParameters,
              );

              return handler.resolve(cloneReq);
            } else {
              final navigator = getIt<NavigationService>().navigator;
              final needToLogout =
                  await navigator.push(materialRoute(WrongToken()));

              if (needToLogout) {
                navigator.popUntil((route) => route.isFirst);
              }
            }
          } else {
            return handler.next(err);
          }
        },
      ),
    );
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
