import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Waypoint', (table) => {
    table.renameColumn('type', 'typeIds');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Waypoint', (table) => {
    table.renameColumn('typeIds', 'type');
  });
}
