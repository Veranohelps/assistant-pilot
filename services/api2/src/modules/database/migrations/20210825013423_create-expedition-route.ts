import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('ExpeditionRoute', (table) => {
    table
      .string('expeditionId', 50)
      .notNullable()
      .references('id')
      .inTable('Expedition')
      .withKeyName(DatabaseConstraints.EXPEDITION_ROUTE_EXPEDITION_ID_FKEY);
    table
      .string('routeId', 50)
      .notNullable()
      .references('id')
      .inTable('Route')
      .withKeyName(DatabaseConstraints.EXPEDITION_ROUTE_ROUTE_ID_FKEY);
    table.jsonb('meta').notNullable().defaultTo('{}');
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());

    table.unique(['expeditionId', 'routeId'], {
      indexName: DatabaseConstraints.EXPEDITION_ROUTE_PKEY,
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('ExpeditionRoute');
}
