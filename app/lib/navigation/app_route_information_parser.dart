import 'package:app/navigation/paths.dart';
import 'package:flutter/material.dart';

class AppRouteInformationParser
    extends RouteInformationParser<AssistantRoutePath> {
  @override
  Future<AssistantRoutePath> parseRouteInformation(
      RouteInformation routeInformation) async {
    // https://api.flutter.dev/flutter/widgets/RouteInformationParser/parseRouteInformation.html
    final uri = Uri.parse(routeInformation.location!);

    print("parseRouteInformation: $uri");

    switch (uri.path) {
      case "/":
        return AssistantRoutePath.home();
      default:
        // TODO: show error screen
        throw Exception("Invalid route: $uri");
    }
  }

  @override
  RouteInformation restoreRouteInformation(AssistantRoutePath path) {
    // https://api.flutter.dev/flutter/widgets/RouteInformationParser/restoreRouteInformation.html

    // should return a route/location based on the path
    // RouteInformation _may_ have a state object

    print("restoreRouteInformation");
    print(path);

    return RouteInformation(location: '/');
  }
}
