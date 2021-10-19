import { Knex } from 'knex';
import { ERouteOrigins } from '../../route/types/route-origin.type';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Route', (table) => {
    table.specificType('boundingBox', 'GEOGRAPHY(POLYGON)').nullable();
  });

  // compute boundingBox values for existing routes
  await knex('Route').update({
    boundingBox: knex.raw('ST_Envelope(coordinate::geometry)') as any,
  });

  await knex.schema.alterTable('Route', (table) => {
    table.specificType('boundingBox', 'GEOGRAPHY(POLYGON)').notNullable().alter();
  });

  // add fields to waypoint
  await knex.schema.alterTable('Waypoint', (table) => {
    table
      .string('originId', 50)
      .notNullable()
      .defaultTo(ERouteOrigins.DERSU)
      .references('id')
      .inTable('RouteOrigin')
      .withKeyName(DatabaseConstraints.WAYPOINT_ORIGIN_ID_FKEY);
    table
      .string('userId', 50)
      .nullable()
      .references('id')
      .inTable('User')
      .withKeyName(DatabaseConstraints.WAYPOINT_USER_ID_FKEY);
  });

  // remove default form waypoint originId
  await knex.schema.alterTable('Waypoint', (table) => {
    table.string('originId', 50).notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Route', (table) => {
    table.dropColumns('boundingBox');
  });
  await knex.schema.alterTable('Waypoint', (table) => {
    table.dropColumns('originId', 'userId');
  });
}
