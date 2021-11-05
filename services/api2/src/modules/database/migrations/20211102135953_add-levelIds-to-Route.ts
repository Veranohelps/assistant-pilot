import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Route', (table) => {
    table.specificType('levelIds', 'text ARRAY').notNullable().defaultTo('{}');

    table.index('levelIds', 'ROUTE_SKILL_IDS_INDEX', 'GIN');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Route', (table) => {
    table.dropColumns('levelIds');
  });
}
