import 'package:app/config/brand_colors.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:app/logic/cubits/authentication/authentication_cubit.dart';
import 'package:app/logic/cubits/profile/profile_cubit.dart';
import 'package:app/ui/components/brand_button/brand_button.dart' as buttons;
import 'package:app/ui/pages/root_tabs/profile/levels/levels.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:unicons/unicons.dart';
import 'package:app/utils/extensions/extensions.dart';

class ProfileTab extends StatelessWidget {
  const ProfileTab({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(LocaleKeys.profile_name.tr()),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(height: 20),
          buildHeader(),
          SizedBox(height: 20),
          Divider(),
          _NavItem(
            title: LocaleKeys.profile_my_levels_name.tr(),
            goTo: LevelsSetting(),
          ),
          Spacer(),
          Center(
            child: buttons.primaryShort(
              text: LocaleKeys.profile_logout.tr(),
              onPressed: context.read<AuthenticationCubit>().logout,
            ),
          ),
          SizedBox(height: 20),
        ],
      ),
    );
  }

  Widget buildHeader() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        children: [
          Container(
            width: 80,
            height: 80,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: BrandColors.grey,
              shape: BoxShape.circle,
            ),
            child: Icon(
              UniconsLine.camera,
              color: BrandColors.white,
              size: 30,
            ),
          ),
          SizedBox(width: 20),
          BlocBuilder<ProfileCubit, ProfileState>(
            builder: (context, state) {
              if (state is! ProfileDersuRegistrationFinished) {
                return Container();
              }
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('${state.profile.firstName} ${state.profile.lastName}')
                      .h2,
                  Text(state.profile.email).p1.withColor(BrandColors.grey),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  const _NavItem({
    Key? key,
    required this.goTo,
    required this.title,
  }) : super(key: key);

  final Widget goTo;
  final String title;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.of(context).push(materialRoute(goTo)),
      child: Container(
        decoration: BoxDecoration(
          border: Border(
            bottom: BorderSide(
              color: BrandColors.grey,
              width: 1,
            ),
          ),
        ),
        padding: EdgeInsets.symmetric(
          vertical: 24,
          horizontal: 20,
        ),
        child: Text(
          title,
        ),
      ),
    );
  }
}
