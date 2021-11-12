import { Knex } from 'knex';
import { generateRecord2 } from '../../common/utilities/generate-record';
import { getEstimatedTime } from '../../route/utilities/analyse-route';

export async function up(knex: Knex): Promise<void> {
  const routes = await knex('Route');
  const activityTypes = await knex('ActivityType').then(generateRecord2((a) => a.id));

  const routeActivityTypes = routes
    .map((route) => {
      const activities = route.activityTypeIds.map((typeId) => {
        const type = activityTypes[typeId];

        return {
          routeId: route.id,
          activityTypeId: type.id,
          estimatedDurationInMinutes: getEstimatedTime({
            distance: route.distanceInMeters,
            eGain: route.elevationGainInMeters,
            eLoss: route.elevationLossInMeters,
            uphillPace: type.uphillPace,
            downhillPace: type.downhillPace,
            defaultPace: type.defaultPace,
            unknown: type.unknownPercentage,
          }),
        };
      });

      return activities;
    })
    .flat();

  if (routes.length) {
    await knex('RouteActivityType').insert(routeActivityTypes);
  }
}

export async function down(): Promise<void> {
  return;
}
