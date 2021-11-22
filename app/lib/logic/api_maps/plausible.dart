import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:app/config/get_it_config.dart';
import 'package:app/logic/api_maps/api.dart';
import 'package:app/logic/models/console_message.dart';
import 'package:dio/adapter.dart';
import 'package:dio/dio.dart';
import 'package:flutter_config/flutter_config.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';

// https://plausible.io/docs/events-api
// https://plausible.io/docs/custom-event-goals#using-custom-props

class PlausibleApi extends ApiMap {
  @override
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
    dio.interceptors.add(InterceptorsWrapper(onError: (DioError e, handler) {
      print('PlausibleApi error');

      return handler.next(e);
    }));

    /// plausible HandshakeException: Handshake error in client
    (dio.httpClientAdapter as DefaultHttpClientAdapter).onHttpClientCreate =
        (HttpClient client) {
      client.badCertificateCallback =
          (X509Certificate cert, String host, int port) => true;
      return client;
    };

    return dio;
  }

  @override
  Future<BaseOptions> get options async {
    var userAgent = getIt<DeviceInfoService>().deviceInfoString();

    return BaseOptions(
      responseType: ResponseType.plain,
      baseUrl: 'https://plausible.io/',
      headers: {
        'Content-Type': 'text/json',
        'User-Agent': userAgent,
        'X-Forwarded-For': '127.0.0.1',
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

    try {
      var eventName = type == CustomEvents.page
          ? "pageview"
          : type.toString().split('.')[1];
      var url = "app://localhost/" + (label ?? "");
      var props =
          "{\"action\": \"$action\", \"label\": \"$label\", \"value\": \"$value\"}";
      var referrer = (type == CustomEvents.page) ? "" : url;

      await client.post(
        'api/event',
        data: jsonEncode({
          "name": eventName,
          "url": url,
          "domain": "${FlutterConfig.get('PLAUSIBLE_URL')}",
          "props": props,
          "referrer": referrer,
          "screen_width":
              getIt<DeviceInfoService>().device?.screenWidth.toInt() ?? 0,
          "screen_height":
              getIt<DeviceInfoService>().device?.screenHeight.toInt() ?? 0,
        }),
      );
    } catch (e) {
      getIt<ConsoleService>()
          .addMessage(ConsoleMessage.warn(text: e.toString()));
    }

    client.close();
  }
}
