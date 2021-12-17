import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('ExpeditionUserEventType', (table) => {
    table
      .string('id', 50)
      .primary({ constraintName: DatabaseConstraints.EXPEDITION_USER_EVENT_TYPE_PKEY });
    table.string('name', 50).notNullable();
    table.text('description').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('ExpeditionUserEventType');
}
