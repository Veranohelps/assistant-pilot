import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('Assessment', (table) => {
    table.string('id', 50).primary({ constraintName: DatabaseConstraints.ASSESSMENT_PKEY });
    table
      .string('userId', 50)
      .notNullable()
      .references('id')
      .inTable('User')
      .withKeyName(DatabaseConstraints.ASSESSMENT_USER_ID_FKEY);
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('Assessment');
}
