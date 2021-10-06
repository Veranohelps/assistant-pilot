import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('RouteOrigin', (table) => {
    table.string('id', 50).primary({ constraintName: DatabaseConstraints.ROUTE_ORIGIN_PKEY });
    table.string('name', 50).notNullable();
    table.text('description').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('RouteOrigin');
}
