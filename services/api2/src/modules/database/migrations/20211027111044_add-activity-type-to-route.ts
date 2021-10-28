import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Route', (table) => {
    table.specificType('activityTypeIds', 'text ARRAY').notNullable().defaultTo('{}');

    table.index('activityTypeIds', 'ACTIVITY_TYPES_INDEX', 'GIN');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Waypoint', (table) => {
    table.dropColumns('activityTypeIds');
  });
}
