part of 'expedition_form.dart';

class SearchPage extends StatefulWidget {
  const SearchPage({
    Key? key,
    required this.formCubit,
  }) : super(key: key);
  final ExpeditionFormCubit formCubit;

  @override
  _SearchPageState createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  String searchString = '';
  @override
  Widget build(BuildContext context) {
    return BlocProvider<UserSearchCubit>(
      create: (context) => UserSearchCubit(),
      child: Builder(builder: (context) {
        var searchCubit = context.watch<UserSearchCubit>();
        return SafeArea(
          child: Scaffold(
            appBar: PreferredSize(
              preferredSize: Size.fromHeight(120),
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: 20),
                decoration: BoxDecoration(
                  border: Border(
                    bottom: BorderSide(
                      color: BrandColors.dGray,
                    ),
                  ),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(height: 10),
                    BrandRawLabel(
                      text: LocaleKeys.basis_search.tr(),
                      isDisabled: false,
                      isEmpty: false,
                      isRequired: true,
                    ),
                    SizedBox(height: 2),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            autofocus: true,
                            style: TextStyle(fontSize: 16, height: 1.2),
                            cursorColor: BrandColors.mGrey,
                            maxLines: 1,
                            decoration: defaultInputDecoration,
                            onChanged: (text) {
                              setState(() {
                                searchString = text;
                              });
                            },
                          ),
                        ),
                        SizedBox(width: 20),
                        TextButton(
                          onPressed: BrandButtons.analiticsOnPressWrapper(
                            () {
                              searchCubit.search(searchString);
                            },
                            'icon button',
                            'search',
                          ),
                          style: TextButton.styleFrom(
                            minimumSize: Size(60, 42),
                            padding: EdgeInsets.zero,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12.0),
                            ),
                            backgroundColor: BrandColors.buttonColor,
                          ),
                          child: Row(
                            children: [
                              SizedBox(width: 10),
                              Icon(
                                Icons.search,
                                size: 20,
                                color: BrandColors.white,
                              ),
                              SizedBox(width: 5),
                              Text(
                                LocaleKeys.basis_search.tr().toUpperCase(),
                                style: ThemeTypo.martaButtonText.copyWith(
                                  color: BrandColors.white,
                                  fontWeight: NamedWeight.medium,
                                ),
                              ),
                              SizedBox(width: 10),
                            ],
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 20),
                  ],
                ),
              ),
            ),
            body: Container(
              padding: EdgeInsets.all(20),
              child: getBody(
                searchCubit.state,
              ),
            ),
            bottomNavigationBar: Container(
              decoration: BoxDecoration(
                border: Border(top: BorderSide(color: BrandColors.dGray)),
              ),
              padding: EdgeInsets.fromLTRB(20, 20, 20,
                  max(20, MediaQuery.of(context).padding.bottom) + 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                mainAxisSize: MainAxisSize.min,
                children: [
                  BrandButtons.primaryBig(
                    text: LocaleKeys.basis_close.tr(),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
            ),
          ),
        );
      }),
    );
  }

  Widget getBody(UserSearchState state) {
    if (state is UserSearchInitial) {
      return Text(LocaleKeys.planning_search_hint.tr()).subtitle1;
    } else if (state is UserSearchEmpty) {
      return Text(LocaleKeys.planning_search_no_results.tr()).subtitle1;
    } else if (state is UserSearchError) {
      return Text(LocaleKeys.planning_search_min_characters.tr()).subtitle1;
    } else if (state is UserSearchLoaded) {
      return ListView(
        padding: EdgeInsets.all(20),
        children: state.users
            .map((u) => UserCard(
                  user: u,
                  formCubit: widget.formCubit,
                ))
            .toList(),
      );
    } else if (state is UserSearchLoading) {
      return Text(LocaleKeys.basis_loading.tr());
    }
    throw 'wrong state';
  }
}

class UserCard extends StatelessWidget {
  const UserCard({
    Key? key,
    required this.user,
    required this.formCubit,
  }) : super(key: key);

  final User user;
  final ExpeditionFormCubit formCubit;

  @override
  Widget build(BuildContext context) {
    var dict = context.read<DictionariesCubit>().state as DictionariesLoaded;
    var usersField = formCubit.users;

    return BlocBuilder<FieldCubit<List<User>>, FieldCubitState<List<User>>>(
      bloc: usersField,
      builder: (context, state) {
        var route = formCubit.route.state.value;
        if (route == null) {
          return Container();
        }

        var levelsTrees = route.levelIds
            .map((levelId) => dict.levelTreeByLevelId(levelId))
            .toList();

        var isInList = state.value.map((u) => u.id).toList().contains(user.id);
        return Opacity(
          opacity: isInList ? 0.3 : 1.0,
          child: Container(
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
                      )
                    ],
                  ),
                  SizedBox(height: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: user.currentLevels
                        .map((k, v) {
                          var tree = dict.levelTreeByLevelId(v);
                          return MapEntry(
                            k,
                            Container(
                              margin: EdgeInsets.all(3),
                              child: Text('${tree[1].name}: ${tree[2].name}'),
                            ),
                          );
                        })
                        .values
                        .toList(),
                  ),
                  SizedBox(height: 10),
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
                            buildLevels(diff)
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                  SizedBox(height: 10),
                  if (!isInList)
                    BrandButtons.primaryShort(
                      text: LocaleKeys.basis_add.tr(),
                      onPressed: () {
                        var newList = [...state.value];
                        newList.add(user);
                        usersField.setValue(newList);
                      },
                    )
                ],
              )),
        );
      },
    );
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
        text: LocaleKeys.planning_levels_under_your_level.tr(),
      );
    } else {
      return TextSpan(
        style:
            ThemeTypo.arimo14Semibold.copyWith(color: BrandColors.marta2BA333),
        text: LocaleKeys.planning_levels_over_your_level.tr(),
      );
    }
  }
}
