import 'package:app/config/brand_colors.dart';
import 'package:app/config/get_it_config.dart';
import 'package:app/generated/locale_keys.g.dart';
import 'package:app/logic/cubits/levels/levels_cubit.dart';
import 'package:app/logic/model/levels.dart';
import 'package:app/ui/components/brand_bottom_sheet/brand_bottom_sheet.dart';
import 'package:app/ui/components/brand_button/brand_button.dart' as buttons;
import 'package:app/ui/helpers/modals.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:unicons/unicons.dart';
import 'package:app/utils/extensions/extensions.dart';

class ProfileTab extends StatelessWidget {
  const ProfileTab({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var items = getIt<LevelsService>().flat();

    return Scaffold(
      appBar: AppBar(
        title: Text(LocaleKeys.profile_name.tr()),
      ),
      body: BlocBuilder<LevelsCubit, LevelsState>(
        builder: (context, state) {
          if (state is! LevelsLoaded) {
            return Center(
              child: CircularProgressIndicator(),
            );
          }
          return SingleChildScrollView(
            physics: ClampingScrollPhysics(),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                mainAxisSize: MainAxisSize.min,
                children: [
                  SizedBox(height: 20),
                  buildHeader(),
                  SizedBox(height: 20),
                  Divider(),
                  SizedBox(height: 10),
                  Text(LocaleKeys.profile_my_levels.tr())
                      .h3
                      .copyWith(textAlign: TextAlign.center),
                  SizedBox(height: 10),
                  ...items.map((levelData) {
                    if (levelData is Category) {
                      return Padding(
                        padding: const EdgeInsets.only(top: 20),
                        child: Text(levelData.name).h3,
                      );
                    }
                    var currentLevel = state.levelsMap[levelData];
                    levelData = levelData as Skill;
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
                                    text: currentLevel!.name,
                                  )
                                : buttons.textButton(
                                    onPressed: () => onLevelChange(
                                      context,
                                      currentLevel,
                                      levelData as Skill,
                                    ),
                                    text: 'Not set up',
                                    color: BrandColors.grey,
                                  ),
                          ),
                        ),
                      ],
                    );
                  }).toList()
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  void onLevelChange(
      BuildContext context, Level? currentLevel, Skill skill) async {
    int _currentSliderValue = currentLevel?.level ?? 0;
    var res = await showBrandBottomSheet(
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
                  text: 'Save',
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
      context.read<LevelsCubit>().setLevel(skill: skill, level: res);
    }
  }

  Row buildHeader() {
    return Row(
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
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Kherel Kechil').h2,
            Text('kherel@gmail.com').p1.withColor(BrandColors.grey),
          ],
        ),
      ],
    );
  }
}
