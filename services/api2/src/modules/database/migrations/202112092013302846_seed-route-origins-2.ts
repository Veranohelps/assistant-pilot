import { Knex } from 'knex';
import { IRouteOrigin } from '../../route/types/route-origin.type';

const origin: IRouteOrigin = {
  id: 'expedition',
  name: 'Expedition',
  description: 'Route from expedition data collected',
};
export async function up(knex: Knex): Promise<void> {
  await knex('RouteOrigin').insert(origin);
}

export async function down(knex: Knex): Promise<void> {
  await knex('RouteOrigin').where('id', origin.id).del();
}
