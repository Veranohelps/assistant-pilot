import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('SkillLevel', (table) => {
    table.string('id', 50).primary({ constraintName: DatabaseConstraints.SKILL_LEVEL_PKEY });
    table
      .string('skillId', 50)
      .notNullable()
      .references('id')
      .inTable('Skill')
      .withKeyName(DatabaseConstraints.SKILL_LEVEL_SKILL_ID_FKEY);
    table.string('name', 255).notNullable();
    table.text('description').nullable();
    table.integer('level').notNullable();
    table.jsonb('meta').notNullable().defaultTo('{}');
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deletedAt').nullable();

    table.unique(['skillId', 'level'], {
      indexName: DatabaseConstraints.SKILL_LEVEL_SKILL_ID_LEVEL_UNIQUE,
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('SkillLevel');
}
