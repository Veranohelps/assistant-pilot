import 'package:app/config/brand_theme.dart';
import 'package:app/logic/cubits/profile/user_routes_cubit.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:app/ui/pages/root_tabs/profile/pages/add_user_gpx.dart';
import 'package:app/ui/pages/root_tabs/routes/routes.dart';
import 'package:app/utils/extensions/extensions.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:cubit_form/cubit_form.dart';
import 'package:flutter/material.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:easy_localization/easy_localization.dart';

class UserRoutes extends StatelessWidget {
  const UserRoutes({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => UserRoutesCubit()..load(),
      child: Builder(
        builder: (context) {
          final userRoutesCubit = context.watch<UserRoutesCubit>();

          return Scaffold(
            appBar: AppBar(title: Text(LocaleKeys.profile_my_routes_name.tr())),
            bottomNavigationBar: Container(
              height: 50,
              width: double.infinity,
              margin: EdgeInsets.only(
                bottom: MediaQuery.of(context).padding.bottom + 10,
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  BrandButtons.primaryBig(
                      text: LocaleKeys.profile_my_routes_import_gpx.tr(),
                      onPressed: () => Navigator.of(context).push(materialRoute(
                          AddUserGpx(userRoutesCubit: userRoutesCubit)))),
                  SizedBox(width: 10),
                  BrandButtons.primaryBig(
                      text: LocaleKeys.profile_my_routes_connect_strava.tr(),
                      onPressed: null),
                ],
              ),
            ),
            body: userRoutesCubit.state is UserRoutesNotLoaded
                ? Text(LocaleKeys.profile_my_routes_loading_routes.tr())
                : ListView(
                    padding: paddingH25V0.copyWith(top: 20, bottom: 80),
                    // crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      for (var route
                          in (userRoutesCubit.state as UserRoutesLoaded).routes)
                        GestureDetector(
                          onTap: null,
                          child: RouteCard(
                            route: route,
                          ),
                        )
                    ],
                  ),
          );
        },
      ),
    );
  }
}
