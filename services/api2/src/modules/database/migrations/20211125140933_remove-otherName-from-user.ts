import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('User', (table) => {
    table.dropColumn('otherName');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('User', (table) => {
    table.dropColumn('otherName');
  });
}
