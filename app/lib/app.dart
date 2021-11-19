import 'package:app/logic/cubits/authentication/authentication_cubit.dart';
import 'package:app/logic/cubits/live/live_cubit.dart';
import 'package:app/logic/cubits/profile/profile_cubit.dart';
import 'package:app/logic/service/permission_handler.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:app/ui/pages/authentication/authentication.dart';
import 'package:app/ui/pages/expedition_live/expedition_live.dart';
import 'package:app/ui/pages/root_route.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:flutter/material.dart';
import 'ui/pages/registration/registration.dart';

class App extends StatefulWidget {
  const App({Key? key}) : super(key: key);

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  @override
  void initState() {
    WidgetsBinding.instance!.addPostFrameCallback(_afterLayout);
    super.initState();
  }

  Future<void> _afterLayout(_) async {
    var liveExpedition = context.read<LiveCubit>().state;

    if (liveExpedition is LiveStateOn) {
      bool allowed =
          await DersuPermissionsHandler.requestPermission(showDialog: false);
      if (allowed) {
        Navigator.of(context).push(
          materialRoute(
            ExpeditionLive(),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    var authState = context.watch<AuthenticationCubit>().state;
    if (authState is NotAuthenticated) {
      return AuthenticationPage();
    } else if (authState is AuthenticationInitial) {
      return const BrandLoader();
    } else if (authState is Authenticated ||
        authState is AuthenticationLoading) {
      var profileState = context.watch<ProfileCubit>().state;
      if (profileState is ProfileNotReady) {
        return const BrandLoader();
      } else if (profileState is ProfileDersuRegistrationNotFinished) {
        return const Registration();
      }
      return const RootPage();
    }
    throw 'wrong auth state';
  }
}
