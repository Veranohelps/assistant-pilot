import 'package:app/config/hive_config.dart';
import 'package:either_option/either_option.dart';
import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:flutter_config/flutter_config.dart';
import 'package:hive/hive.dart';

final auth0domain = FlutterConfig.get('AUTH0_DOMAIN');
final auth0audience = FlutterConfig.get('AUTH0_AUDIENCE');
final auth0clientId = FlutterConfig.get('AUTH0_CLIENT_ID');
final auth0redirectUrl =
    '${FlutterConfig.get('AUTH0_REDIRECT_SCHEME')}://login-callback';
final auth0issuer = 'https://$auth0domain';

class AuthenticationRepository {
  final appAuth = FlutterAppAuth();
  final box = Hive.box(HiveContants.authentication.txt);

  Future<Option<AuthorizationTokenResponse>> login() async {
    AuthorizationTokenResponse? result;
    try {
      result = await appAuth.authorizeAndExchangeCode(
        AuthorizationTokenRequest(
          auth0clientId,
          auth0redirectUrl,
          additionalParameters: {'audience': auth0audience},
          promptValues: ['login'],
          issuer: auth0issuer,
          scopes: ['offline_access'],
        ),
      );
    } catch (e) {
      print(e);
    }
    if (result != null) {
      box.put(HiveContants.refreshToken.txt, result.refreshToken);
    }
    return Option.of(result);
  }

  Future<void> logout() async {
    await box.clear();
  }

  Future<Option<TokenResponse>> load() async {
    String? storedRefreshToken = await box.get(HiveContants.refreshToken.txt);
    if (storedRefreshToken == null) {
      return Option.empty();
    }

    final result = await appAuth.token(TokenRequest(
      auth0clientId,
      auth0redirectUrl,
      issuer: auth0issuer,
      additionalParameters: {'audience': auth0audience},
      refreshToken: storedRefreshToken,
      scopes: ['offline_access'],
    ));

    return Option.of(result);
  }
}
