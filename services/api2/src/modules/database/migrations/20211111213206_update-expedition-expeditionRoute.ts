import { Knex } from 'knex';
import { round } from 'lodash';
import { generateGroupRecord2 } from '../../common/utilities/generate-record';
import { extendKnex } from '../knex/extensions.knex';

extendKnex();

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Expedition', (table) => {
    table.float('estimatedDurationInMinutes').nullable();
    table.specificType('routeIds', 'text ARRAY').notNullable().defaultTo('{}');

    table.index('routeIds', 'EXPEDITION_ROUTE_IDS_INDEX', 'GIN');
  });
  await knex.schema.alterTable('ExpeditionRoute', (table) => {
    table.dropColumn('durationInHours');
    table.specificType('activityTypeIds', 'text ARRAY').notNullable().defaultTo('{}');

    table.index('activityTypeIds', 'EXPEDITION_ROUTE_ACTIVITY_TYPE_IDS_INDEX', 'GIN');
  });

  const expeditions = await knex('Expedition').withColumns('Expedition');
  const expeditionRoutes = await knex('ExpeditionRoute').then(
    generateGroupRecord2((er) => er.expeditionId),
  );
  const routeActivities = await knex('RouteActivityType').then(
    generateGroupRecord2((a) => a.routeId),
  );

  const expeditionRouteUpdates: any[] = [];
  const updates = expeditions.map((expedition) => {
    const eRs = expeditionRoutes[expedition.id];
    let duration = 0;

    eRs.forEach((er) => {
      const routeActivity = routeActivities[er.routeId].filter((a) =>
        expedition.activityTypeIds.includes(a.activityTypeId),
      );
      const activityDurations = routeActivity.map((a) => a.estimatedDurationInMinutes);

      if (activityDurations.length) {
        duration += Math.max(...activityDurations);
      }

      expeditionRouteUpdates.push({
        ...er,
        activityTypeIds: routeActivity.map((a) => a.activityTypeId),
      });
    });

    return {
      ...expedition,
      coordinate: knex.raw(`ST_GeomFromGeoJSON(?)`, [JSON.stringify(expedition.coordinate)]),
      routeIds: eRs.map((er) => er.routeId),
      estimatedDurationInMinutes: round(duration, 2),
    };
  });

  if (updates.length) {
    await knex('Expedition')
      .insert(updates)
      .onConflict(['id'])
      .merge(['estimatedDurationInMinutes', 'routeIds'] as any[]);
    await knex('ExpeditionRoute')
      .insert(expeditionRouteUpdates)
      .onConflict(['expeditionId', 'routeId'])
      .merge(['activityTypeIds'] as any[]);
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Expedition', (table) => {
    table.dropColumns('estimatedDurationInMinutes', 'routeIds');
  });
  await knex.schema.alterTable('ExpeditionRoute', (table) => {
    table.dropColumn('activityTypeIds');
    table.float('durationInHours').nullable();
  });
}
