part of 'expedition_form.dart';

class TerrenoTab extends StatelessWidget {
  TerrenoTab({
    Key? key,
    required this.formCubit,
    required this.isEditable,
  }) : super(key: key);
  final ExpeditionFormCubit formCubit;
  final bool isEditable;

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
    var route = formCubit.route.state.value!;
    var dictionaries =
        context.read<DictionariesCubit>().state as DictionariesLoaded;

    var types =
        route.activityTypeIds.map((id) => dictionaries.findActiveTypeById(id));

    var selectedActivityTypeFiled = formCubit.activityTypeIds;
    return BlocBuilder<FieldCubit<List<String>>, FieldCubitState<List<String>>>(
        bloc: selectedActivityTypeFiled,
        builder: (context, selectedActivityTypesState) {
          return FutureBuilder<MaterialData>(
            future: getMaterialData(types),
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                var materialsMarkdown = "";
                for (var activity in types) {
                  if (selectedActivityTypesState.value.contains(activity.id)) {
                    materialsMarkdown = materialsMarkdown +
                        "\n" +
                        snapshot.data!.data[activity.id]!;
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
                      Text(LocaleKeys.planning_terrain_no_activities_for_route
                          .tr()),
                    ...types
                        .map(
                          (t) => CheckboxListTile(
                            title: Text(t.name),
                            value:
                                selectedActivityTypesState.value.contains(t.id),
                            onChanged: isEditable
                                ? (bool? value) {
                                    selectedActivityTypeFiled.setValue([t.id]);
                                  }
                                : null,
                          ),
                        )
                        .toList(),
                    SizedBox(height: 20),
                    MarkdownBody(
                        data: materialsMarkdown, styleSheet: markdownStyle),
                    SizedBox(height: 20 + MediaQuery.of(context).padding.bottom)
                  ],
                );
              } else {
                return BrandLoader();
              }
            },
          );
        });
  }
}

class MaterialData {
  final Map<String, String> data;

  MaterialData({required this.data});
}
