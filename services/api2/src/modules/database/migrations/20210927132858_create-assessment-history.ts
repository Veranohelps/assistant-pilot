import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('AssessmentHistory', (table) => {
    table.string('id', 50).primary({ constraintName: DatabaseConstraints.ASSESSMENT_HISTORY_PKEY });
    table
      .string('assessmentId', 50)
      .notNullable()
      .references('id')
      .inTable('Assessment')
      .withKeyName(DatabaseConstraints.ASSESSMENT_HISTORY_ASSESSMENT_ID_FKEY);
    table
      .string('skillId', 50)
      .notNullable()
      .references('id')
      .inTable('Skill')
      .withKeyName(DatabaseConstraints.ASSESSMENT_HISTORY_SKILL_ID_FKEY);
    table
      .string('levelId', 50)
      .notNullable()
      .references('id')
      .inTable('SkillLevel')
      .withKeyName(DatabaseConstraints.ASSESSMENT_HISTORY_LEVEL_ID_FKEY);
    table
      .string('userId', 50)
      .notNullable()
      .references('id')
      .inTable('User')
      .withKeyName(DatabaseConstraints.ASSESSMENT_HISTORY_USER_ID_FKEY);
    table.boolean('isCurrent').notNullable().defaultTo(false);
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('AssessmentHistory');
}
