import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Expedition', (table) => {
    table.specificType('activityTypeIds', 'text ARRAY').notNullable().defaultTo('{}');

    table.index('activityTypeIds', 'EXPEDITION_ACTIVITY_TYPE_IDS_INDEX', 'GIN');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Expedition', (table) => {
    table.dropColumns('activityTypeIds');
  });
}
