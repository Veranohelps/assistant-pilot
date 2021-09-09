import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('Route', (table) => {
    table.string('id', 50).primary({ constraintName: DatabaseConstraints.ROUTE_PKEY });
    table.text('name').notNullable();
    table.specificType('coordinate', 'GEOGRAPHY(LINESTRINGZ)').notNullable();
    table.jsonb('meta').notNullable().defaultTo('{}');
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deletedAt').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('Route');
}
