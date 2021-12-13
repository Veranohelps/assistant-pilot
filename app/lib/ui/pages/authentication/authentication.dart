import 'package:app/logic/cubits/authentication/authentication_cubit.dart';
import 'package:flutter/material.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:app/utils/extensions/extensions.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:easy_localization/easy_localization.dart';

class AuthenticationPage extends StatelessWidget {
  const AuthenticationPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final authenticationCubit = context.read<AuthenticationCubit>();
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
            image: DecorationImage(
                image: AssetImage("assets/splash_screen/background_bw.png",
                    bundle: DefaultAssetBundle.of(context)),
                fit: BoxFit.cover)),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(LocaleKeys.login_title.tr()).h2,
                SizedBox(height: 30),
                Text(LocaleKeys.login_text.tr()),
                SizedBox(height: 30),
                Text(LocaleKeys.login_invitation_only.tr(),
                    style: TextStyle(fontStyle: FontStyle.italic)),
                SizedBox(height: 30),
                BrandButtons.primaryBig(
                  text: LocaleKeys.login_cta.tr(),
                  onPressed: authenticationCubit.state is NotAuthenticated
                      ? authenticationCubit.login
                      : null,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
