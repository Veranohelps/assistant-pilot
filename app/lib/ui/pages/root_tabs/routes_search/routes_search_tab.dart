import 'package:app/config/brand_colors.dart';
import 'package:app/config/theme_typo.dart';
import 'package:app/logic/api_maps/routes.dart';
import 'package:app/logic/cubits/expeditions/expeditions_cubit.dart';
import 'package:app/logic/cubits/routes/route_search_cubit.dart';
import 'package:app/logic/forms/expedition_form/expedition_form.dart';
import 'package:app/logic/forms/routes_search_form.dart';
import 'package:app/logic/models/geographical_location.dart';
import 'package:app/logic/models/route.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:app/ui/pages/root_tabs/routes/routes.dart';
import 'package:app/ui/pages/route_detatils/route_details.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:cubit_form/cubit_form.dart';
import 'package:flutter/material.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:flutter/services.dart';

class RoutesSearchTab extends StatefulWidget {
  const RoutesSearchTab({Key? key}) : super(key: key);

  @override
  State<RoutesSearchTab> createState() => _RoutesSearchState();
}

class _RoutesSearchState extends State<RoutesSearchTab> {
  @override
  Widget build(BuildContext context) {
    final routeSearchCubit = RouteSearchCubit();
    return MultiBlocProvider(
      providers: [
        BlocProvider(
            create: (context) => ExpeditionFormCubit(
                initType: ExpeditionFormMode.ownerPlanning,
                expeditionsCubit: context.read<ExpeditionsCubit>())),
        BlocProvider(
          create: (context) => routeSearchCubit,
        ),
        BlocProvider(
            create: (context) =>
                RoutesSearchForm(routeSearchCubit: routeSearchCubit))
      ],
      child: Builder(builder: (context) {
        final form = context.watch<RoutesSearchForm>();
        final textController = TextEditingController(text: '');
        return Scaffold(
          appBar: AppBar(
            title: Text(LocaleKeys.route_search_title.tr()),
          ),
          body: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: textController,
                          autofocus: true,
                          style: TextStyle(fontSize: 16, height: 1.2),
                          cursorColor: BrandColors.mGrey,
                          maxLines: 1,
                          inputFormatters: [
                            LengthLimitingTextInputFormatter(20)
                          ],
                        ),
                      ),
                      SizedBox(width: 10),
                      GestureDetector(
                        onTap: () {
                          form.textField.setValue(textController.text);
                          form.trySubmit();
                        },
                        child: Row(
                          children: [
                            Icon(
                              Icons.search,
                              size: 20,
                              // color: BrandColors.white,
                            ),
                            SizedBox(width: 5),
                            Text(
                              LocaleKeys.basis_search.tr().toUpperCase(),
                              style: ThemeTypo.martaButtonText.copyWith(
                                  // color: BrandColors.white,
                                  // fontWeight: NamedWeight.medium,
                                  ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 30),
                  Expanded(child: RoutesSearchResult()),
                ],
              )),
        );
      }),
    );
  }
}

class RoutesSearchResult extends StatelessWidget {
  const RoutesSearchResult({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final state = context.watch<RouteSearchCubit>().state;
    final form = context.read<RoutesSearchForm>();

    if (state is RouteSearching) {
      return BrandLoader();
    }

    if (state is RouteSearchFinished) {
      return RoutesSearchResults(
          searchResults: state.result,
          parameters: state.parameters,
          resetFormCallback: form.reset);
    }

    if (state is RouteSearchError) {
      return RoutesSearchError(error: state.error);
    }

    return RoutesSearchInitial();
  }
}

class RoutesSearchResults extends StatelessWidget {
  final RouteSearchParameters parameters;
  final RouteSearchResults searchResults;
  final VoidCallback resetFormCallback;
  const RoutesSearchResults(
      {Key? key,
      required this.searchResults,
      required this.parameters,
      required this.resetFormCallback})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        Row(
          children: [
            BrandButtons.primaryShort(
                onPressed: () => resetFormCallback(),
                text: "X '${parameters.text!}'"),
          ],
        ),
        SizedBox(height: 15),
        (searchResults.routes.isEmpty)
            ? Text(LocaleKeys.route_search_no_routes_found.tr())
            : Text(LocaleKeys.route_search_routes.tr()).h2,
        SizedBox(height: 15),
        for (var route in searchResults.routes)
          GestureDetector(
            onTap: () => _Planning.start(context, route),
            child: RouteCard(route: route),
          ),
        SizedBox(height: 15),
        (searchResults.locations.isEmpty)
            ? Text(LocaleKeys.route_search_no_locations_found.tr())
            : Text(LocaleKeys.route_search_locations.tr()).h2,
        SizedBox(height: 15),
        for (var location in searchResults.locations)
          GeographicalLocationCard(
            location: location,
          ),
      ],
    );
  }
}

class GeographicalLocationCard extends StatelessWidget {
  const GeographicalLocationCard({Key? key, required this.location})
      : super(key: key);
  final GeographicalLocation location;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          location.fullName,
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 5),
        (location.routes.isEmpty)
            ? Text(LocaleKeys.route_search_no_routes_for_this_location.tr())
            : Text(LocaleKeys.route_search_routes_for_this_location.tr()),
        SizedBox(height: 15),
        for (var route in location.routes)
          GestureDetector(
              onTap: () => _Planning.start(context, route),
              child: RouteCard(route: route)),
      ],
    );
  }
}

class RoutesSearchInitial extends StatelessWidget {
  const RoutesSearchInitial({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Text(LocaleKeys.route_search_hint.tr());
  }
}

class RoutesSearchError extends StatelessWidget {
  final String error;
  const RoutesSearchError({Key? key, required this.error}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      Text(
        LocaleKeys.route_search_error.tr(),
        style: TextStyle(fontWeight: FontWeight.bold),
      ),
      SizedBox(height: 15),
      Text(
        error,
        style: TextStyle(fontStyle: FontStyle.italic),
      )
    ]);
  }
}

class _Planning {
  static void start(BuildContext context, DersuRouteShort route) {
    Navigator.of(context).push(
      noAnimationRoute(
        RouteDetails(
          route: route,
          formCubit: context.read<ExpeditionFormCubit>(),
        ),
        route.name,
      ),
    );
  }
}
