import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('BpaProvider', (table) => {
    table.string('id', 50).primary({ constraintName: DatabaseConstraints.BPA_PROVIDER_PKEY });
    table.text('name').notNullable();
    table.text('description').notNullable();
    table.boolean('disabled').notNullable().defaultTo(false);
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('BpaProvider');
}
