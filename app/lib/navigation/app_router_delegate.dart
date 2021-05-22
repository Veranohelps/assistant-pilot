import 'package:app/model/models.dart';
import 'package:app/navigation/paths.dart';
import 'package:app/repository/network_repository.dart';
import 'package:app/view/WaypointTappedDialog.dart';
import 'package:app/view/about.dart';
import 'package:app/view/expedition_details.dart';
import 'package:app/view/expedition_list.dart';
import 'package:app/view/expedition_map.dart';
import 'package:app/view/home.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class AppRouterDelegate extends RouterDelegate<AssistantRoutePath>
    with ChangeNotifier, PopNavigatorRouterDelegateMixin<AssistantRoutePath> {
  final GlobalKey<NavigatorState> navigatorKey;

  Expedition? _selectedExpedition;
  DersuRoute? _selectedRoute;
  bool _showHomeScreen = true;
  bool _showExpeditionList = false;
  bool _showExpeditionDetails = false;
  bool _showExpeditionMap = false;
  bool _showAboutPage = false;
  bool _expeditionStarted = false;
  bool _showingWaypointDialogue = false;
  Map<String, bool> _waypointsWarned = new Map();
  late Future<List<Expedition>> futureExpeditions =
      NetworkRepository().fetchExpeditions();
  late Future<DersuRoute> futureRoute;

  // the app state is stored directly on the RouterDelegate,
  // but could also be separated into another class

  AppRouterDelegate() : navigatorKey = GlobalKey<NavigatorState>();

  AssistantRoutePath get currentConfiguration {
    // https://api.flutter.dev/flutter/widgets/RouterDelegate/currentConfiguration.html
    // return a path based on state
    print("AppRouterDelegate get currentConfiguration");

    if (_showHomeScreen) {
      return AssistantRoutePath.home();
    }

    if (_showExpeditionList) {
      return AssistantRoutePath.expeditionList();
    }

    if (_showExpeditionDetails) {
      return AssistantRoutePath.expeditionDetails();
    }

    if (_showExpeditionMap) {
      return AssistantRoutePath.expeditionMap();
    }

    if (_expeditionStarted) {
      return AssistantRoutePath.expeditionStarted();
    }

    if (_showAboutPage) {
      return AssistantRoutePath.about();
    }

    print("AppRouterDelegate get currentConfiguration UNKNOWN STATE");
    return AssistantRoutePath.unknown();
  }

  bool _handlePagePop(page, result) {
    print("Page POP: " + page.settings.runtimeType.toString());

    if (!page.didPop(result)) {
      print("Page did NOT POP!");
      return false;
    }

    // NOTE (JD): this is the back button callback handler
    // the page received here is the one in which the back button was pressed
    // the check below is U G L Y, need much much cleaner way of updating the state

    switch (page.settings.runtimeType.toString()) {
      case "ExpeditionListPage":
        _showHomeScreen = true;
        _showExpeditionList =
            _showExpeditionDetails = _showExpeditionMap = false;
        break;
      case "ExpeditionDetailsPage":
        _showExpeditionList = true;
        _showHomeScreen = _showExpeditionDetails = _showExpeditionMap = false;
        break;
      case "ExpeditionMapPage":
        // NOTE: this is back from both normal and live MapPage
        _waypointsWarned.clear();
        _expeditionStarted = false;
        _showExpeditionDetails = true;
        _showHomeScreen = _showExpeditionList = _showExpeditionMap = false;
        break;
      case "AboutPage":
        _showHomeScreen = true;
        _showAboutPage = false;
        break;
      default:
        throw Exception(
            "Unhandled page POP: " + page.settings.runtimeType.toString());
    }

    notifyListeners();
    return true;
  }

  void _handleWaypointTapped(BuildContext context, WayPoint waypoint) {
    if (_showingWaypointDialogue == false) {
      if (_waypointsWarned.containsKey(waypoint.id) == false) {
        _waypointsWarned.addEntries([MapEntry(waypoint.id, true)]);
        _showingWaypointDialogue = true;
        showDialog(
          context: context,
          builder: (_) => new WaypointTappedDialog(
              waypoint: waypoint,
              dismissHandler: () => _handleWaypointDialogDismissed(context)),
        );
      } else {
        print("already shown waypoint " + waypoint.id);
      }
    } else {
      print("already showing waypoint");
    }
  }

  void _handleWaypointDialogDismissed(BuildContext context) {
    Navigator.of(context).pop();
    _showingWaypointDialogue = false;
  }

  void _handleAboutPageTapped() {
    _showAboutPage = true;
    _showHomeScreen = _showExpeditionList =
        _showExpeditionDetails = _showExpeditionMap = false;
    notifyListeners();
  }

  void _handleExpeditionListTapped() {
    _showExpeditionList = true;
    _showHomeScreen = _showExpeditionDetails = _showExpeditionMap = false;
    notifyListeners();
  }

  void _handleExpeditionTapped(Expedition expedition) {
    _selectedExpedition = expedition;
    // TODO (JD): assuming and only handling one route for the expedition
    futureRoute =
        NetworkRepository().fetchRoute(_selectedExpedition!.routes.first.url);
    _showExpeditionDetails = true;
    _showHomeScreen = _showExpeditionList = _showExpeditionMap = false;
    notifyListeners();
  }

  void _onMapSelected(DersuRoute route) {
    _selectedRoute = route;
    _showExpeditionMap = true;
    _showHomeScreen = _showExpeditionList = _showExpeditionDetails = false;
    notifyListeners();
  }

  void _onExpeditionStart(DersuRoute route) {
    _selectedRoute = route;
    _expeditionStarted = true;
    _showExpeditionMap =
        _showHomeScreen = _showExpeditionList = _showExpeditionDetails = false;
    notifyListeners();
  }

  void _handleExpeditionStop(BuildContext context) {
    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final List<Page<dynamic>> currentPages = [
      HomePage(
          expeditionListTapped: _handleExpeditionListTapped,
          aboutPageTapped: _handleAboutPageTapped)
    ];

    // add or remove to currentPages based on state

    if (_showExpeditionList) {
      currentPages.add(ExpeditionListPage(
          futureExpeditions: futureExpeditions,
          expeditionTapped: _handleExpeditionTapped));
    }

    if (_showExpeditionDetails) {
      currentPages.add(ExpeditionDetailsPage(
          expedition: _selectedExpedition!,
          futureRoute: futureRoute,
          onMapSelected: _onMapSelected,
          onExpeditionStart: _onExpeditionStart));
    }

    if (_showExpeditionMap) {
      currentPages.add(ExpeditionMapPage(
          live: false,
          expedition: _selectedExpedition!,
          route: _selectedRoute!,
          onWaypointTapped: _handleWaypointTapped,
          handleExpeditionStop: null));
    }

    if (_expeditionStarted) {
      currentPages.add(ExpeditionMapPage(
          live: true,
          expedition: _selectedExpedition!,
          route: _selectedRoute!,
          onWaypointTapped: _handleWaypointTapped,
          handleExpeditionStop: _handleExpeditionStop));
    }

    if (_showAboutPage) {
      currentPages.add(AboutPage());
    }

    return Navigator(
      key: navigatorKey,
      pages: currentPages,
      onPopPage: _handlePagePop,
    );
  }

  @override
  Future<void> setNewRoutePath(AssistantRoutePath path) async {
    // called with AssistantRoutePath, and must update the application state to reflect the change
    // (for example, by setting the an expedition or route id) and call notifyListeners.

    print("setNewRoutePath: " + path.name);

    switch (path.name) {
      case "HOME":
        _showHomeScreen = true;
        _showExpeditionList =
            _showExpeditionDetails = _showExpeditionMap = false;
        break;
      case "EXPEDITION-LIST":
        _showExpeditionList = true;
        _showHomeScreen = _showExpeditionDetails = _showExpeditionMap = false;
        break;
      case "EXPEDITION-DETAILS":
        _showExpeditionDetails = true;
        _showHomeScreen = _showExpeditionList = _showExpeditionMap = false;
        break;
      case "EXPEDITION-MAP":
        _showExpeditionMap = true;
        _showHomeScreen = _showExpeditionDetails = _showExpeditionList = false;
        break;
      default:
        throw Exception("Unexpected AssistantRoutePath: " + path.name);
    }
  }
}
