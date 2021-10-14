import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:app/config/get_it_config.dart';
import 'package:app/logic/api_maps/api.dart';
import 'package:app/logic/get_it/analytics.dart';
import 'package:dio/adapter.dart';
import 'package:dio/dio.dart';
import 'package:flutter_config/flutter_config.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';

class PlausibleApi extends ApiMap {
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

    /// plausible HandshakeException: Handshake error in client
    (dio.httpClientAdapter as DefaultHttpClientAdapter).onHttpClientCreate =
        (HttpClient client) {
      client.badCertificateCallback =
          (X509Certificate cert, String host, int port) => true;
      return client;
    };

    /// plausible HandshakeException: Handshake error in client
    (dio.httpClientAdapter as DefaultHttpClientAdapter).onHttpClientCreate =
        (HttpClient client) {
      client.badCertificateCallback =
          (X509Certificate cert, String host, int port) => true;
      return client;
    };

    return dio;
  }

  Future<BaseOptions> get options async {
    var userAgent = getIt<DeviceInfoService>().deviceInfoString();

    return BaseOptions(
      responseType: ResponseType.plain,
      baseUrl: 'https://plausible.io/',
      headers: {
        'Content-Type': 'text/plain',
        'User-Agent': userAgent,
      },
    );
  }

  Future<void> sendPlausibleEvent({
    required CustomEvents type,
    required String? action,
    required String? label,
    required dynamic value,
  }) async {
    var client = await getClient();

    client.post(
      'api/event',
      data: jsonEncode({
        "n": type.toString().split('.')[1],
        "u": "http://${FlutterConfig.get('PLAUSIBLE_URL')}/",
        "d": "${FlutterConfig.get('PLAUSIBLE_URL')}",
        "p":
            "{\"action\": \"$action\", \"label\": \"$label\", \"value\": \"$value\"}",
        "r": null,
        "w": getIt<DeviceInfoService>().device?.screenWidth.toInt() ?? 0,
        "h": getIt<DeviceInfoService>().device?.screenHeight.toInt() ?? 0,
      }),
    );
  }
}
