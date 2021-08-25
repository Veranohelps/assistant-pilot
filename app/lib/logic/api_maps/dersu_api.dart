import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_config/flutter_config.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';

import 'api.dart';

abstract class DersuApi extends ApiMap {
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
    return BaseOptions(baseUrl: FlutterConfig.get('DERSU_API_BASE_URL'));
  }
}
