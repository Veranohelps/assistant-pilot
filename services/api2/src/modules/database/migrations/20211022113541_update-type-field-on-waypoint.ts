import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Waypoint', (table) => {
    table.dropColumn('type');
  });

  await knex.schema.alterTable('Waypoint', (table) => {
    table.specificType('type', 'text ARRAY').notNullable().defaultTo('{}');

    table.index('type', 'WAYPOINT_TYPES_INDEX', 'GIN');
  });

  await knex.schema.alterTable('Waypoint', (table) => {
    table.specificType('type', 'text ARRAY').notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Waypoint', (table) => {
    table.dropColumns('type');
    table.dropIndex('type', 'WAYPOINT_TYPES_INDEX');
  });
  await knex.schema.alterTable('Waypoint', (table) => {
    table.string('type', 50).notNullable().defaultTo('waypoint');
  });
  await knex.schema.alterTable('Waypoint', (table) => {
    table.string('type', 50).notNullable().alter();
  });
}
