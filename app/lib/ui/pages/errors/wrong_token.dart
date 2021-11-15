import 'package:app/config/brand_colors.dart';
import 'package:app/logic/cubits/authentication/authentication_cubit.dart';
import 'package:flutter/material.dart';
import 'package:app/utils/extensions/text_extension.dart';
import 'package:app/utils/extensions/extensions.dart';
import 'package:app/generated/locale_keys.g.dart';

class WrongToken extends StatelessWidget {
  const WrongToken({Key? key, this.error, this.stackTrace}) : super(key: key);

  final Object? error;
  final StackTrace? stackTrace;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Center(
            child: Column(
              children: [
                SizedBox(height: 100),
                Text('🤯 🧐', style: TextStyle(fontSize: 50)),
                SizedBox(height: 20),
                Text(LocaleKeys.errors_token.tr()).p0,
                SizedBox(height: 20),
                GestureDetector(
                  onTap: () async {
                    await context.read<AuthenticationCubit>().logout();
                    Navigator.of(context).pop(true);
                  },
                  child: Container(
                    padding: EdgeInsets.all(10),
                    decoration: BoxDecoration(
                        color: BrandColors.red,
                        borderRadius: BorderRadius.circular(10)),
                    child: Text('Logout').withColor(Colors.white),
                  ),
                ),
                if (stackTrace != null) ...[
                  SizedBox(height: 20),
                  Text('Stack trace: ').p0,
                  SizedBox(height: 20),
                  Expanded(
                    child: SingleChildScrollView(
                        child: Text(stackTrace.toString()).p0),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
