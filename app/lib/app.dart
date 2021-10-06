import 'package:app/logic/cubits/authentication/authentication_cubit.dart';
import 'package:app/logic/cubits/profile/profile_cubit.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:app/ui/pages/authentication/authentication.dart';
import 'package:app/ui/pages/rootRoute.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'ui/pages/registration/registration.dart';

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var authState = context.watch<AuthenticationCubit>().state;
    if (authState is NotAuthenticated) {
      return AuthenticationPage();
    } else if (authState is AuthenticationInitial) {
      return BrandLoading();
    } else if (authState is Authenticated ||
        authState is AuthenticationLoading) {
      var profileState = context.watch<ProfileCubit>().state;
      if (profileState is ProfileNotReady) {
        return BrandLoading();
      } else if (profileState is ProfileDersuRegistrationNotFinished) {
        return Registration();
      }
      return RootPage();
    }
    throw 'wrong auth state';
  }
}
