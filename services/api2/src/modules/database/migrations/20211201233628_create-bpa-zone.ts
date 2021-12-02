import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('BpaZone', (table) => {
    table.string('id', 50).primary({ constraintName: DatabaseConstraints.BPA_ZONE_PKEY });
    table.text('name').notNullable();
    table.text('description').nullable();
    table.specificType('coordinate', 'GEOGRAPHY(POLYGON)').notNullable();
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('BpaZone');
}
