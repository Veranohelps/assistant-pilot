part of 'expedition_form.dart';

class GroupTab extends StatelessWidget {
  const GroupTab({
    Key? key,
    required this.formCubit,
    required this.isEditable,
  }) : super(key: key);

  final ExpeditionFormCubit formCubit;
  final bool isEditable;
  @override
  Widget build(BuildContext context) {
    var usersField = formCubit.users;

    return BlocBuilder<FieldCubit<List<User>>, FieldCubitState<List<User>>>(
      bloc: usersField,
      builder: (context, state) {
        if (state.value.isEmpty) {
          return Center(
            child: Text(LocaleKeys.planning_group_search_hint.tr()),
          );
        }

        return ListView(
          padding: const EdgeInsets.all(20),
          children: state.value.map((user) {
            var isOwner = formCubit.fullExpedition?.userId == user.id;

            var hasRemoveButton = isEditable && !isOwner;
            return PlaningGroupUserCard(
                user: user,
                route: formCubit.route.state.value,
                hasRemoveButton: hasRemoveButton,
                onRemove: () {
                  formCubit.users.setValue(formCubit.users.state.value
                      .where((element) => element.id != user.id)
                      .toList());
                });
          }).toList(),
        );
      },
    );
  }
}

class PlaningGroupUserCard extends StatelessWidget {
  const PlaningGroupUserCard({
    Key? key,
    required this.user,
    required this.route,
    required this.hasRemoveButton,
    required this.onRemove,
  }) : super(key: key);

  final User user;
  final DersuRouteFull? route;
  final bool hasRemoveButton;
  final VoidCallback onRemove;
  @override
  Widget build(BuildContext context) {
    if (route == null) {
      return Container();
    }
    var dict = context.read<DictionariesCubit>().state as DictionariesLoaded;
    var levelsTrees = route!.levelIds
        .map((levelId) => dict.levelTreeByLevelId(levelId))
        .toList();

    return Container(
        decoration: BoxDecoration(
          boxShadow: kElevationToShadow[1],
          color: BrandColors.white,
          borderRadius: BorderRadius.circular(20),
        ),
        padding: EdgeInsets.all(20),
        margin: EdgeInsets.only(bottom: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 45,
                  height: 45,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    image: user.avatar != null
                        ? DecorationImage(
                            image: NetworkImage(user.avatar!),
                            fit: BoxFit.cover,
                          )
                        : null,
                  ),
                ),
                SizedBox(width: 20),
                Text(
                  '${user.firstName} ${user.lastName}',
                  style: ThemeTypo.h6,
                ),
              ],
            ),
            SizedBox(height: 10),
            if (user is GroupUser)
              (user as GroupUser).isOwner
                  ? Text(
                      LocaleKeys.planning_group_expedition_owner.tr(),
                      style: ThemeTypo.p0,
                    )
                  : Text(
                      '${LocaleKeys.planning_group_guest_status.tr()}: ${(user as GroupUser).inviteStatus.txt}',
                      style: ThemeTypo.p0,
                    ),
            Wrap(
              children: levelsTrees.map((tree) {
                var diff = compareUserLevesWithNeededLevel(
                    dict, tree, user.currentLevels);
                return RichText(
                  text: TextSpan(
                    style: ThemeTypo.arimo14Semibold.copyWith(
                      color: BrandColors.black,
                    ),
                    children: [
                      TextSpan(text: '${tree[1].name}: '),
                      buildLevels(diff),
                    ],
                  ),
                );
              }).toList(),
            ),
            SizedBox(height: 10),
            if (hasRemoveButton)
              BrandButtons.primaryShort(
                  text: LocaleKeys.basis_remove.tr(), onPressed: onRemove),
          ],
        ));
  }

  TextSpan buildLevels(int? diff) {
    if (diff == null) {
      return TextSpan(
        style:
            ThemeTypo.arimo14Semibold.copyWith(color: BrandColors.martaBF961A),
        text: LocaleKeys.planning_levels_not_set.tr(),
      );
    } else if (diff == 0) {
      return TextSpan(
        style:
            ThemeTypo.arimo14Semibold.copyWith(color: BrandColors.martaBF961A),
        text: LocaleKeys.planning_levels_same_level.tr(),
      );
    } else if (diff < 0) {
      return TextSpan(
        style: ThemeTypo.arimo14Semibold.copyWith(color: BrandColors.red),
        text: LocaleKeys.planning_levels_over_your_level.tr(),
      );
    } else {
      return TextSpan(
        style:
            ThemeTypo.arimo14Semibold.copyWith(color: BrandColors.marta2BA333),
        text: LocaleKeys.planning_levels_under_your_level.tr(),
      );
    }
  }
}
