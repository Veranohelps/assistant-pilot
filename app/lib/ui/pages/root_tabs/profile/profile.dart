import 'package:app/config/brand_colors.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:app/logic/cubits/authentication/authentication_cubit.dart';
import 'package:app/logic/cubits/profile/profile_cubit.dart';
import 'package:app/logic/forms/profile_edit/profile_edit.dart';
import 'package:app/ui/components/avatar_button/avatar_button.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:app/ui/components/brand_divider/brand_divider.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:app/ui/components/brand_text_field/brand_text_field.dart';
import 'package:app/ui/pages/delete_profile/delete_profile.dart';
import 'package:app/ui/pages/root_tabs/profile/pages/levels.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:cubit_form/cubit_form.dart';
import 'package:flutter/material.dart';
import 'package:app/utils/extensions/extensions.dart';

part 'pages/edit.dart';

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
          Container(
            padding: EdgeInsets.only(right: 20),
            alignment: Alignment.centerRight,
            child: BrandButtons.primaryShort(
              text: LocaleKeys.profile_edit_profile.tr(),
              onPressed: () {
                Navigator.of(context).push(materialRoute(_EditProfile()));
              },
            ),
          ),
          buildProfileInfo(),
          SizedBox(height: 20),
          Divider(),
          _NavItem(
            title: LocaleKeys.profile_my_levels_name.tr(),
            goTo: LevelsSetting(),
          ),
        ],
      ),
    );
  }

  Widget buildProfileInfo() {
    return BlocBuilder<ProfileCubit, ProfileState>(
      builder: (context, state) {
        if (state is! ProfileDersuRegistrationFinished) {
          return Container();
        }
        var profile = state.profile;
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            children: [
              SizedBox(height: 40),
              AvatarButtonWidget(
                onAvatarDelete: context.read<ProfileCubit>().deleteAvatar,
                onFileSelected: context.read<ProfileCubit>().updateAvatar,
                url: state.profile.avatar,
              ),
              SizedBox(width: 20),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(profile.firstName).h2,
                  Text(profile.lastName).h2,
                ],
              ),
            ],
          ),
        );
      },
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
              color: BrandColors.mGrey,
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
