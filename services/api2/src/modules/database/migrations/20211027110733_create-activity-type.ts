import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('ActivityType', (table) => {
    table.string('id', 50).primary({ constraintName: DatabaseConstraints.ACTIVITY_TYPE_PKEY });
    table.string('name', 255).notNullable();
    table.text('description').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('ActivityType');
}
