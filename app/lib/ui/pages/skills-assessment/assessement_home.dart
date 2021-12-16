import 'package:app/logic/cubits/dictionaries/dictionaries_cubit.dart';
import 'package:app/logic/cubits/profile/profile_cubit.dart';
import 'package:app/logic/models/levels.dart';
import 'package:app/logic/models/profile.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:app/ui/pages/skills-assessment/base_assessment.dart';
import 'package:app/utils/route_transitions/basic.dart';
import 'package:cubit_form/cubit_form.dart';
import 'package:flutter/material.dart';

class AssessmentHome extends StatefulWidget {
  const AssessmentHome({Key? key}) : super(key: key);

  @override
  State<AssessmentHome> createState() => _AssessmentHome();
}

class _AssessmentHome extends State<AssessmentHome> {
  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
        providers: [
          BlocProvider(create: (context) => context.read<DictionariesCubit>()),
          BlocProvider(create: (context) => context.read<ProfileCubit>())
        ],
        child: Builder(
          builder: (context) {
            var allSkills =
                (context.read<DictionariesCubit>().state as DictionariesLoaded)
                    .allSkils;
            var profile =
                (context.read<ProfileCubit>().state as ProfileReady).profile;

            var allLevels =
                (context.read<DictionariesCubit>().state as DictionariesLoaded)
                    .allLevels;

            var currentLevels = (profile is FilledProfile)
                ? profile.currentLevels
                : <String, String>{};
            return Scaffold(
              appBar: AppBar(
                title: Text("Skills assessment HOME"),
              ),
              body: Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      for (var skill in allSkills)
                        _SkillWidget(
                          skill: skill,
                          level: _findLevelForSkillInUserProfile(
                              allLevels, currentLevels, skill),
                          openCallback: () => _openSkillAssessment(
                              skill,
                              _findLevelForSkillInUserProfile(
                                  allLevels, currentLevels, skill)),
                        ),
                    ]),
              ),
            );
          },
        ));
  }

  void _openSkillAssessment(Skill skill, Level? currentLevel) {
    Navigator.of(context).push(materialRoute(BaseAssessment(
      skill: skill,
      currentLevel: currentLevel,
    )));
  }

  Level? _findLevelForSkillInUserProfile(
      List<Level> allLevels, Map<String, String> userLevels, Skill skill) {
    return userLevels.containsKey(skill.id)
        ? allLevels.firstWhere((level) => level.skillId == skill.id)
        : null;
  }
}

class _SkillWidget extends StatelessWidget {
  final Skill skill;
  final Level? level;
  final VoidCallback openCallback;

  const _SkillWidget(
      {Key? key,
      required this.skill,
      required this.level,
      required this.openCallback})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BrandButtons.primaryBig(
        text:
            skill.name + " (" + ((level == null) ? "nope" : level!.name) + ")",
        onPressed: () => openCallback());
  }
}
