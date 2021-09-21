import 'package:flutter_appauth/flutter_appauth.dart';

class AuthTokenService {
  TokenResponse? tokenResponse;

  String? get idToken => tokenResponse?.idToken;

  bool get hasToken => tokenResponse != null;
}
