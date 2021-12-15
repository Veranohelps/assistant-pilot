import 'package:app/logic/api_maps/dersu_api.dart';
import 'package:app/logic/api_maps/helpers.dart';
import 'package:app/logic/models/geographical_location.dart';
import 'package:app/logic/models/route.dart';

const routesUrl = '/route';

class RoutesApi extends PrivateDersuApi {
  Future<List<DersuRouteShort>> routes() async {
    var client = await getClient();
    var res = await client.get(routesUrl);
    client.close();

    return (res.data['data']['routes'] as List)
        .map<DersuRouteShort>((json) => DersuRouteShort.fromJson(json))
        .toList();
  }

  Future<List<DersuRouteShort>> userRoutes() async {
    var client = await getClient();
    var res = await client.get('/route?owner=me');
    client.close();

    return (res.data['data']['routes'] as List)
        .map<DersuRouteShort>((json) => DersuRouteShort.fromJson(json))
        .toList();
  }

  Future<DersuRouteFull> route(String url) async {
    var client = await getClient();
    var res = await client.get(url);
    client.close();

    var route = res.data['data']['route'] as Map<String, dynamic>;
    return DersuRouteFull.fromJson(formatRoutesResponse(route));
  }

  Future<RouteSearchResults> search(RouteSearchParameters parameters) async {
    var client = await getClient();
    var res = await client.get('/route/search?' + parameters.toString());
    client.close();

    var routes = (res.data['data']['routes'] as List)
        .map<DersuRouteShort>((json) => DersuRouteShort.fromJson(json))
        .toList();

    var locations = (res.data['data']['locations'] as List)
        .map((json) => GeographicalLocation.fromJson(json))
        .toList();
    return RouteSearchResults(routes: routes, locations: locations);
  }
}

class RouteSearchParameters {
  final String? text;

  RouteSearchParameters({required this.text});

  @override
  String toString() {
    var params = '';

    if (text != null) {
      params = 'name=' + Uri.encodeQueryComponent(text!); // url encode!
    }

    return params;
  }
}

class RouteSearchResults {
  final List<DersuRouteShort> routes;
  final List<GeographicalLocation> locations;

  RouteSearchResults({required this.routes, required this.locations});
}
