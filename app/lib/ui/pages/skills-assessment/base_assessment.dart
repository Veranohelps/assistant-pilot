import 'package:app/config/brand_theme.dart';
import 'package:app/logic/models/levels.dart';
import 'package:app/ui/components/brand_button/brand_button.dart';
import 'package:app/utils/extensions/text_extension.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_markdown/flutter_markdown.dart';

class BaseAssessment extends StatefulWidget {
  final Skill skill;
  final Level? currentUserLevel;
  final ValueChanged<Level> setNewLevelCallback;

  const BaseAssessment(
      {Key? key,
      required this.skill,
      required this.currentUserLevel,
      required this.setNewLevelCallback})
      : super(key: key);

  @override
  State<BaseAssessment> createState() => _BaseAssessment();
}

class _BaseAssessment extends State<BaseAssessment> {
  int _currentLevelIndex = -1;

  @override
  Widget build(BuildContext context) {
    var skill = widget.skill;
    var currentUserLevel = widget.currentUserLevel;

    if (_currentLevelIndex < 0) {
      _currentLevelIndex = currentUserLevel!.level - 1;
    }

    var currentDisplayLevel = skill.children.elementAt(_currentLevelIndex);

    return FutureBuilder<Map<String, String>>(
        future: getSkillInformation(skill),
        builder: (context, snapshot) {
          return Scaffold(
            appBar: AppBar(
              title: Text(skill.name),
            ),
            body: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
              child: ListView(
                children: [
                  Text(skill.name).h2,
                  SizedBox(height: 10),
                  Text("Current user level for this skill: " +
                      ((currentUserLevel == null)
                          ? "not set"
                          : currentUserLevel.name)),
                  SizedBox(height: 20),
                  Text(currentDisplayLevel.name).h5,
                  SizedBox(height: 10),
                  if (snapshot.data != null)
                    MarkdownBody(
                      data: snapshot.data![currentDisplayLevel.id]!,
                      styleSheet: markdownStyle,
                    ),
                ],
              ),
            ),
            bottomSheet: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              mainAxisSize: MainAxisSize.min,
              children: [
                Slider(
                  min: 0,
                  max: skill.children.length - 1,
                  value: _currentLevelIndex.toDouble(),
                  label: skill.children.elementAt(_currentLevelIndex).name,
                  onChanged: (double value) {
                    _setLevel(value.toInt());
                  },
                  divisions: skill.children.length - 1,
                ),
                BrandButtons.primaryBig(
                    text: "I am at this level",
                    onPressed: () => widget.setNewLevelCallback(
                        skill.children.elementAt(_currentLevelIndex))),
                SizedBox(
                  height: 50, // would be good to make this dynamic
                )
              ],
            ),
          );
        });
  }

  void _setLevel(int levelIndex) {
    setState(() {
      _currentLevelIndex = levelIndex;
    });
  }

  Future<Map<String, String>> getSkillInformation(Skill skill) async {
    var data = <String, String>{};
    for (var level in skill.children) {
      var levelContent = await rootBundle
          .loadString('assets/content/skill-levels/' + level.id + '.md');
      data[level.id] = levelContent;
    }
    return data;
  }
}
