import { Knex } from 'knex';
import { IRouteOrigin } from '../../route/types/route-origin.type';

const origins: IRouteOrigin[] = [
  {
    id: 'dersu',
    name: 'Dersu',
    description: 'Routes provided and curated by Dersu',
  },
  { id: 'strava', name: 'Strava', description: '' },
  { id: 'garmin', name: 'Garmin', description: '' },
  { id: 'manual', name: 'Manual', description: '' },
];

export async function up(knex: Knex): Promise<void> {
  await knex('RouteOrigin').insert(origins);
}

export async function down(knex: Knex): Promise<void> {
  await knex('RouteOrigin')
    .whereIn(
      'id',
      origins.map((o) => o.id),
    )
    .del();
}
