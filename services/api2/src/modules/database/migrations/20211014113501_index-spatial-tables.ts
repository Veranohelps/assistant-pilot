import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Route', (table) => {
    table.index('coordinate', 'ROUTE_COORDINATE_INDEX', 'GIST');
    table.index('boundingBox', 'ROUTE_BOUNDING_BOX_INDEX', 'GIST');
  });
  await knex.schema.alterTable('Expedition', (table) => {
    table.index('coordinate', 'EXPEDITION_COORDINATE_INDEX', 'GIST');
  });
  await knex.schema.alterTable('Waypoint', (table) => {
    table.index('coordinate', 'WAYPOINT_COORDINATE_INDEX', 'GIST');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Route', (table) => {
    table.dropIndex('coordinate', 'ROUTE_COORDINATE_INDEX');
    table.dropIndex('boundingBox', 'ROUTE_BOUNDING_BOX_INDEX');
  });
  await knex.schema.alterTable('Expedition', (table) => {
    table.dropIndex('coordinate', 'EXPEDITION_COORDINATE_INDEX');
  });
  await knex.schema.alterTable('Waypoint', (table) => {
    table.dropIndex('coordinate', 'WAYPOINT_COORDINATE_INDEX');
  });
}
