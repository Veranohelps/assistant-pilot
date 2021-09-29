import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('UserLevel', (table) => {
    table.string('id', 50).primary({ constraintName: DatabaseConstraints.USER_LEVEL_PKEY });
    table
      .string('assessmentId', 50)
      .notNullable()
      .references('id')
      .inTable('Assessment')
      .withKeyName(DatabaseConstraints.USER_LEVEL_ASSESSMENT_ID_FKEY);
    table
      .string('skillId', 50)
      .notNullable()
      .references('id')
      .inTable('Skill')
      .withKeyName(DatabaseConstraints.USER_LEVEL_SKILL_ID_FKEY);
    table
      .string('levelId', 50)
      .notNullable()
      .references('id')
      .inTable('SkillLevel')
      .withKeyName(DatabaseConstraints.USER_LEVEL_LEVEL_ID_FKEY);
    table
      .string('userId', 50)
      .notNullable()
      .references('id')
      .inTable('User')
      .withKeyName(DatabaseConstraints.USER_LEVEL_USER_ID_FKEY);
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());

    table.unique(['skillId', 'userId'], {
      indexName: DatabaseConstraints.USER_LEVEL_SKILL_ID_USER_ID_UNIQUE,
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('UserLevel');
}
