import 'package:app/config/brand_colors.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:app/logic/cubits/dictionaries/dictionaries_cubit.dart';
import 'package:app/logic/cubits/profile/profile_cubit.dart';
import 'package:app/logic/model/levels.dart';
import 'package:app/ui/components/brand_bottom_sheet/brand_bottom_sheet.dart';
import 'package:app/ui/components/brand_loading/brand_loading.dart';
import 'package:app/ui/helpers/modals.dart';
import 'package:app/utils/extensions/text_extension.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:app/ui/components/brand_button/brand_button.dart' as buttons;

class LevelsSetting extends StatefulWidget {
  const LevelsSetting({Key? key}) : super(key: key);

  @override
  _LevelsSettingState createState() => _LevelsSettingState();
}

class _LevelsSettingState extends State<LevelsSetting> {
  Map<String, String> assessments = {};

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance!.addPostFrameCallback(_afterLayout);
  }

  void _afterLayout(_) {
    setState(() {
      assessments = (context.read<ProfileCubit>().state
              as ProfileDersuRegistrationFinished)
          .profile
          .currentLevels;
    });
  }

  @override
  Widget build(BuildContext context) {
    var profileCubit = context.watch<ProfileCubit>();
    var profileState = profileCubit.state;

    var dictionariesState = context.watch<DictionariesCubit>().state;
    if (profileState is! ProfileDersuRegistrationFinished ||
        dictionariesState is! DictionariesLoaded) {
      return BrandLoading();
    }

    var items = <LevelsCatalogData>[];

    for (final categorie in dictionariesState.categories) {
      items.add(categorie);
      items.addAll(categorie.children);
    }
    return Scaffold(
      appBar: AppBar(
        title: Text(LocaleKeys.profile_my_levels.tr()),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            ...items.map((levelData) {
              if (levelData is Category) {
                return Padding(
                  padding: const EdgeInsets.only(top: 20),
                  child: Text(levelData.name).h3,
                );
              }
              levelData = levelData as Skill;
              var currentLevel =
                  levelData.levelByLevelId(assessments[levelData.id]);
              var hasLevel = currentLevel != null;
              return Row(
                children: [
                  Expanded(
                    flex: 1,
                    child: Text('${levelData.name}:').h4,
                  ),
                  Expanded(
                    flex: 1,
                    child: Center(
                      child: hasLevel
                          ? buttons.primaryShort(
                              onPressed: () => onLevelChange(
                                context,
                                currentLevel,
                                levelData as Skill,
                              ),
                              label: 'Level - Change',
                              text: currentLevel!.name,
                            )
                          : buttons.textButton(
                              label: 'Level - Not set up',
                              onPressed: () => onLevelChange(
                                context,
                                currentLevel,
                                levelData as Skill,
                              ),
                              text: LocaleKeys.profile_not_set_up.tr(),
                              color: BrandColors.grey,
                            ),
                    ),
                  ),
                ],
              );
            }).toList(),
            Spacer(),
            Center(
              child: buttons.primaryShort(
                text: LocaleKeys.profile_save_and_close.tr(),
                onPressed: () {
                  context.read<ProfileCubit>().setNewAssessments(assessments);
                  Navigator.of(context).pop();
                },
              ),
            ),
            SizedBox(height: 20)
          ],
        ),
      ),
    );
  }

  void onLevelChange(
      BuildContext context, Level? currentLevel, Skill skill) async {
    int _currentSliderValue = currentLevel?.level ?? 0;
    var res = await showBrandBottomSheet<Level>(
      context: context,
      builder: (context) => StatefulBuilder(builder: (
        context,
        StateSetter setter,
      ) {
        var selectedLevel =
            skill.children.firstWhere((el) => el.level == _currentSliderValue);

        return BrandBottomSheet(
          child: Column(
            children: [
              Text('Set: ${skill.name}').h1,
              SizedBox(height: 20),
              Text(selectedLevel.name).h3,
              SizedBox(height: 20),
              Container(
                height: 100,
                child: Center(
                  child: Text(
                    selectedLevel.description,
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
              Slider(
                value: _currentSliderValue.toDouble(),
                min: 0,
                max: 4,
                label: _currentSliderValue.round().toString(),
                onChanged: (double value) {
                  setter(() {
                    _currentSliderValue = value.toInt();
                  });
                },
              ),
              buttons.textButton(
                  label: 'Change level config',
                  text: LocaleKeys.basis_close.tr(),
                  onPressed: () {
                    Navigator.of(context).pop(selectedLevel);
                  }),
              SafeArea(child: SizedBox(height: 5)),
            ],
          ),
        );
      }),
    );
    if (res != null) {
      setState(() {
        assessments[skill.id] = res.id;
      });
    }
  }
}
