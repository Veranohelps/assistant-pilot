import 'package:app/model/expedition.dart';
import 'package:app/repository/network_repository.dart';
import 'package:app/view/expedition_details.dart';
import 'package:app/view/expedition_list.dart';
import 'package:app/view/expedition_map.dart';
import 'package:app/view/generic_error.dart';
import 'package:app/view/generic_loader.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart' as DotEnv;

Future main() async {
  await DotEnv.load(fileName: "develop-public.env");
  runApp(DersuAssistantApp());
}

class DersuAssistantApp extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => _AppState();
}

class _AppState extends State<DersuAssistantApp> {
  AppRouterDelegate _routerDelegate = AppRouterDelegate();
  AppRouteInformationParser _routeInformationParser =
      AppRouteInformationParser();

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Dersu Assistant',
      routerDelegate: _routerDelegate,
      routeInformationParser: _routeInformationParser,
    );
  }
}

class AppRouteInformationParser
    extends RouteInformationParser<AssistantRoutePath> {
  @override
  Future<AssistantRoutePath> parseRouteInformation(
      RouteInformation routeInformation) async {
    final uri = Uri.parse(routeInformation.location!);

    print("uri: $uri");

    // Handle '/'
    return AssistantRoutePath.expeditionList();

    // // Handle '/book/:id'
    // if (uri.pathSegments.length == 2) {
    //   if (uri.pathSegments[0] != 'book') return BookRoutePath.unknown();
    //   var remaining = uri.pathSegments[1];
    //   var id = int.tryParse(remaining);
    //   if (id == null) return BookRoutePath.unknown();
    //   return BookRoutePath.details(id);
    // }
    //
    // // Handle unknown routes
    // return BookRoutePath.unknown();
  }

  @override
  RouteInformation restoreRouteInformation(AssistantRoutePath path) {
    print("restoreRouteInformation");
    print(path);

    return RouteInformation(location: '/');

    // if (path.isUnknown) {
    //   return RouteInformation(location: '/404');
    // }
    // if (path.isHomePage) {
    //   return RouteInformation(location: '/');
    // }
    // return RouteInformation(location: '/book/${path.id}');
  }
}

class AppRouterDelegate extends RouterDelegate<AssistantRoutePath>
    with ChangeNotifier, PopNavigatorRouterDelegateMixin<AssistantRoutePath> {
  final GlobalKey<NavigatorState> navigatorKey;

  Expedition? _selectedExpedition;
  DersuRoute? _selectedRoute;
  bool showExpeditionMap = false;
  late Future<List<Expedition>> futureExpeditions =
      NetworkRepository().fetchExpeditions();

  late Future<DersuRoute> futureRoute;

  // the app state is stored directly on the RouterDelegate,
  // but could also be separated into another class

  // Book? _selectedBook;
  // bool showHomePage = true;
  // bool show404 = false;

  AppRouterDelegate() : navigatorKey = GlobalKey<NavigatorState>();

  AssistantRoutePath get currentConfiguration {
    print("AppRouterDelegate.get currentConfiguration");

    // if (show404) {
    //   return BookRoutePath.unknown();
    // }
    //
    // if (_selectedBook != null) {
    //   return BookRoutePath.details(books.indexOf(_selectedBook!));
    // }

    return AssistantRoutePath.expeditionList();
  }

  @override
  Widget build(BuildContext context) {
    final List<Page<dynamic>> currentPages = [
      MaterialPage(
          key: ValueKey("ExpeditionListPage"),
          child: FutureBuilder<List<Expedition>>(
            future: futureExpeditions,
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                return ExpeditionListScreen(
                    expeditions: snapshot.data!,
                    onTapped: _handleExpeditionTapped);
              } else if (snapshot.hasError) {
                print("Error while fetching expeditions 👇");
                print(snapshot.error);
                return GenericError(errorMessage: snapshot.error.toString());
              }
              return GenericLoader();
            },
          ))
    ];

    if (_selectedExpedition != null) {
      if (showExpeditionMap == true) {
        currentPages.add(ExpeditionMapPage(
            expedition: _selectedExpedition!, route: _selectedRoute!));
      } else {
        currentPages.add(ExpeditionDetailsPage(
            expedition: _selectedExpedition!, onMapSelected: _onMapSelected));
      }
    }

    return Navigator(
      key: navigatorKey,
      pages: currentPages,
      onPopPage: (page, result) {
        if (!page.didPop(result)) {
          return false;
        }

        // NOTE (JD): this is the back button callback handler
        // the page received here is the one in which the back button was pressed
        // the check below is U G L Y, need much much cleaner way of updating the state

        if (page.settings.runtimeType.toString() == "ExpeditionMapPage") {
          showExpeditionMap = false;
        } else if (page.settings.runtimeType.toString() ==
            "ExpeditionDetailsPage") {
          _selectedExpedition = null;
        }

        notifyListeners();
        return true;
      },
    );
  }

  @override
  Future<void> setNewRoutePath(AssistantRoutePath path) async {
    // called with BookRoutePath, and must update the application state to reflect the change
    // (for example, by setting the selectedBookId) and call notifyListeners.

    print("setNewRoutePath");
    print(path);

    // if (path.isUnknown) {
    //   _selectedBook = null;
    //   show404 = true;
    //   showHomePage = false;
    //   return;
    // }
    //
    // if (path.isDetailsPage) {
    //   if (path.id <= 0 || path.id > books.length - 1) {
    //     show404 = true;
    //     return;
    //   }
    //
    //   _selectedBook = books[path.id];
    // } else {
    //   _selectedBook = null;
    // }
    //
    // show404 = false;
  }

  void _handleExpeditionTapped(Expedition expedition) {
    print("Expedition selected: $expedition");
    _selectedExpedition = expedition;

    if (_selectedExpedition!.routes.isNotEmpty) {
      print("About to load first route ONLY");
      futureRoute =
          NetworkRepository().fetchRoute(_selectedExpedition!.routes.first.url);
      futureRoute
          .then((route) => _onRouteLoaded(route))
          .catchError((error) => _onRouteLoadingError(error));
    }

    notifyListeners();
  }

  void _onRouteLoaded(route) {
    print("Route loaded");
    print(route.name);
    _selectedRoute = route;
    notifyListeners();
  }

  void _onRouteLoadingError(error) {
    print("Error while trying to load route");
    print(error.toString());
    _selectedRoute = null;
    notifyListeners();
  }

  void _onMapSelected(bool selected) {
    showExpeditionMap = true;
    notifyListeners();
  }
}

class AssistantRoutePath {
  // int id = 0;
  // final bool isUnknown;
  final String name;

  AssistantRoutePath.expeditionList() : name = "EXPEDITION-LIST";
  // BookRoutePath.list()
  //     : isUnknown = false,
  //       name = "LIST";
  // BookRoutePath.details(this.id)
  //     : isUnknown = false,
  //       name = "DETAILS";
  // BookRoutePath.unknown()
  //     : isUnknown = true,
  //       name = "UNKNOWN";

  // bool get isHomePage => id == 0;
  // bool get isDetailsPage => id != 0;

  @override
  String toString() {
    return "AssistantRoutePath name: $name";
  }
}
