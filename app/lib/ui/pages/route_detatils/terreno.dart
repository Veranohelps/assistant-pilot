part of 'route_details.dart';

class TerrenoTab extends StatelessWidget {
  const TerrenoTab({Key? key}) : super(key: key);

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
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(height: 20),
        Text(
          'Activity types',
          style: ThemeTypo.h2,
        ),
        SizedBox(height: 20),
        if (types.isEmpty) Text('Emtpy'),
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
      ],
    );
  }
}
