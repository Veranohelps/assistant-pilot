import { Knex } from 'knex';
import { ERouteOrigins } from '../../route/types/route-origin.type';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Route', (table) => {
    table
      .string('globalId', 50)
      .nullable()
      .unique({ indexName: DatabaseConstraints.ROUTE_GLOBAL_ID_UNIQUE });
    table
      .string('originId', 50)
      .notNullable()
      .defaultTo(ERouteOrigins.DERSU)
      .references('id')
      .inTable('RouteOrigin')
      .withKeyName(DatabaseConstraints.ROUTE_ORIGIN_ID_FKEY);
    table
      .string('userId', 50)
      .nullable()
      .references('id')
      .inTable('User')
      .withKeyName(DatabaseConstraints.ROUTE_USER_ID_FKEY);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Route', (table) => {
    table.dropColumns('globalId', 'originId', 'userId');
  });
}
