import { Knex } from 'knex';
import { ILineStringGeometry } from '../../common/types/geojson.type';
import { analyseRoute } from '../../route/utilities/analyse-route';
import { extendKnex } from '../knex/extensions.knex';

extendKnex();

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Route', (table) => {
    table.float('distanceInMeters').nullable();
    table.float('highestPointInMeters').nullable();
    table.float('lowestPointInMeters').nullable();
    table.float('elevationGainInMeters').nullable();
    table.float('elevationLossInMeters').nullable();
    table.specificType('meteoPointsOfInterests', 'GEOGRAPHY(MULTIPOINTZ)').nullable();
  });

  const routes = await knex('Route').withColumns('Route', { selectAll: true });

  const updatedRoutes = routes.map((route) => {
    const params = analyseRoute(route.coordinate as ILineStringGeometry);

    return {
      ...route,
      highestPointInMeters: params.highestPointInMeters,
      lowestPointInMeters: params.lowestPointInMeters,
      elevationGainInMeters: params.elevationGainInMeters,
      elevationLossInMeters: params.elevationLossInMeters,
      meteoPointsOfInterests: knex.raw(`ST_GeomFromGeoJSON(?)`, [
        JSON.stringify(params.meteoPointsOfInterests),
      ]),
      coordinate: knex.raw(`ST_GeomFromGeoJSON(?)`, [JSON.stringify(route.coordinate)]),
      boundingBox: knex.raw(`ST_GeomFromGeoJSON(?)`, [JSON.stringify(route.boundingBox)]),
    };
  });

  if (updatedRoutes.length) {
    await knex('Route')
      .insert(updatedRoutes as any[])
      .onConflict('id')
      .merge([
        'distanceInMeters',
        'highestPointInMeters',
        'lowestPointInMeters',
        'elevationGainInMeters',
        'elevationLossInMeters',
        'meteoPointsOfInterests',
      ] as any[]);
    await knex('Route').update({
      distanceInMeters: knex.raw(
        `st_lengthspheroid(coordinate::geometry, 'SPHEROID["WGS 84",6378137,298.257223563]')`,
      ),
    });
  }

  await knex.schema.alterTable('Route', (table) => {
    table.float('distanceInMeters').notNullable().alter();
    table.float('highestPointInMeters').notNullable().alter();
    table.float('lowestPointInMeters').notNullable().alter();
    table.float('elevationGainInMeters').notNullable().alter();
    table.float('elevationLossInMeters').notNullable().alter();
    table.specificType('meteoPointsOfInterests', 'GEOGRAPHY(MULTIPOINTZ)').notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Route', (table) => {
    table.dropColumns(
      'distanceInMeters',
      'highestPointInMeters',
      'lowestPointInMeters',
      'elevationGainInMeters',
      'elevationLossInMeters',
      'meteoPointsOfInterests',
    );
  });
}
