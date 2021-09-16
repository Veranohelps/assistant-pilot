import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('SkillCategory', (table) => {
    table.string('id', 50).primary({ constraintName: DatabaseConstraints.SKILL_CATEGORY_PKEY });
    table.string('name', 255).notNullable();
    table.text('description').nullable();
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deletedAt').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('SkillCategory');
}
