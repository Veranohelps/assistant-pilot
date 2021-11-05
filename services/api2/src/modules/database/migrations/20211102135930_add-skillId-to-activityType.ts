import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('ActivityType', (table) => {
    table
      .string('skillId', 50)
      .nullable()
      .references('id')
      .inTable('Skill')
      .withKeyName(DatabaseConstraints.ACTIVITY_TYPE_SKILL_ID_FKEY);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('ActivityType', (table) => {
    table.dropColumns('skillId');
  });
}
