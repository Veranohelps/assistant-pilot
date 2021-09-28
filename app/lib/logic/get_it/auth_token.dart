import 'package:flutter_appauth/flutter_appauth.dart';

class AuthTokenService {
  TokenResponse? tokenResponse;

  String? get accessToken => tokenResponse?.accessToken;

  bool get hasToken => tokenResponse != null;
}
