part of 'route_details.dart';

class TerrenoTab extends StatelessWidget {
  TerrenoTab({Key? key}) : super(key: key);

  final MarkdownStyleSheet markdownStyle = MarkdownStyleSheet(
      h1: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
      h2: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
      p: TextStyle(fontSize: 14));

  Future<MaterialData> getMaterialData(Iterable<ActivityType> types) async {
    var data = <String, String>{};
    for (var activityType in types) {
      data[activityType.id] = await rootBundle
          .loadString('assets/content/' + activityType.id + '.md');
    }
    return MaterialData(data: data);
  }

  @override
  Widget build(BuildContext context) {
    var route = context.watch<RouteCubit>().state;
    var dictionaries = context.watch<DictionariesCubit>().state;
    var activityCubit = context.watch<SelectActivityTypesCubit>();
    if (route == null || dictionaries is! DictionariesLoaded) {
      return BrandLoader();
    }

    var types =
        route.activityTypeIds.map((id) => dictionaries.findActiveTypeById(id));

    return FutureBuilder<MaterialData>(
      future: getMaterialData(types),
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          var materialsMarkdown = "";
          for (var activity in types) {
            if (activityCubit.state.contains(activity.id)) {
              materialsMarkdown =
                  materialsMarkdown + "\n" + snapshot.data!.data[activity.id]!;
            }
          }

          return ListView(
            padding: EdgeInsets.all(20),
            children: [
              SizedBox(height: 20),
              Text(
                LocaleKeys.planning_terrain_activities.tr(),
                style: ThemeTypo.h2,
              ),
              SizedBox(height: 20),
              if (types.isEmpty)
                Text(LocaleKeys.planning_terrain_no_activities_for_route.tr()),
              ...types
                  .map(
                    (t) => CheckboxListTile(
                      title: Text(t.name),
                      value: activityCubit.state.contains(t.id),
                      onChanged: (bool? value) {
                        if (value!) {
                          activityCubit.addId(t.id);
                        } else {
                          activityCubit.removeId(t.id);
                        }
                      },
                    ),
                  )
                  .toList(),
              SizedBox(height: 20),
              MarkdownBody(data: materialsMarkdown, styleSheet: markdownStyle),
              SizedBox(height: 20 + MediaQuery.of(context).padding.bottom)
            ],
          );
        } else {
          return BrandLoader();
        }
      },
    );
  }
}

class MaterialData {
  final Map<String, String> data;

  MaterialData({required this.data});
}
