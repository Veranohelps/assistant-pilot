import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('RouteActivityType', (table) => {
    table
      .string('routeId', 50)
      .notNullable()
      .references('id')
      .inTable('Route')
      .withKeyName(DatabaseConstraints.ROUTE_ACTIVITY_TYPE_ROUTE_ID_FKEY);
    table
      .string('activityTypeId', 50)
      .notNullable()
      .references('id')
      .inTable('ActivityType')
      .withKeyName(DatabaseConstraints.ROUTE_ACTIVITY_TYPE_ACTIVITY_TYPE_ID_FKEY);
    table.float('estimatedDurationInMinutes').notNullable();

    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());

    table.unique(['activityTypeId', 'routeId'], {
      indexName: DatabaseConstraints.ROUTE_ACTIVITY_TYPE_PKEY,
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('RouteActivityType');
}
