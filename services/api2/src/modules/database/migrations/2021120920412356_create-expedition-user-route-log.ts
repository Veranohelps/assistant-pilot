import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('ExpeditionUserRouteLog', (table) => {
    table.string('id', 50).primary({ constraintName: DatabaseConstraints.EXPEDITION_LOG_PKEY });
    table
      .string('expeditionId', 50)
      .notNullable()
      .references('id')
      .inTable('Expedition')
      .withKeyName(DatabaseConstraints.EXPEDITION_LOG_EXPEDITION_ID_FKEY);
    table
      .string('userId', 50)
      .nullable()
      .references('id')
      .inTable('User')
      .withKeyName(DatabaseConstraints.EXPEDITION_LOG_USER_ID_FKEY);
    table
      .string('actualRouteId', 50)
      .nullable()
      .references('id')
      .inTable('Route')
      .withKeyName(DatabaseConstraints.EXPEDITION_LOG_ROUTE_ID_FKEY);
    table.specificType('routeIds', 'text ARRAY').notNullable().defaultTo('{}');
    table.text('name').notNullable();
    table.text('description').nullable();
    table.string('originId', 50).notNullable();
    table.string('visibility', 50).notNullable().defaultTo('public');
    table.float('averageSpeed').nullable();
    table.timestamp('startDateTime');
    table.timestamp('endDateTime');
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());

    table.index('routeIds', 'EXPEDITION_USER_ROUTE_LOG_ROUTE_IDS_INDEX', 'GIN');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('ExpeditionUserRouteLog');
}
