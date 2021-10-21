import 'package:app/logic/cubits/authentication/authentication_cubit.dart';
import 'package:flutter/material.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:app/utils/extensions/extensions.dart';

class AuthenticationPage extends StatelessWidget {
  AuthenticationPage();

  @override
  Widget build(BuildContext context) {
    final authenticationCubit = context.read<AuthenticationCubit>();
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text('Login').h1,
            SizedBox(height: 30),
            BrandButtons.primaryShort(
              text: 'Login',
              onPressed: authenticationCubit.state is NotAuthenticated
                  ? authenticationCubit.login
                  : null,
            ),
          ],
        ),
      ),
    );
  }
}
