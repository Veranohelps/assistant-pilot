import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTable('ExpeditionWaypoint');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.createTable('ExpeditionWaypoint', (table) => {
    table
      .string('expeditionId', 50)
      .notNullable()
      .references('id')
      .inTable('Expedition')
      .withKeyName(DatabaseConstraints.EXPEDITION_WAYPOINT_EXPEDITION_ID_FKEY);
    table
      .string('waypointId', 50)
      .notNullable()
      .references('id')
      .inTable('Waypoint')
      .withKeyName(DatabaseConstraints.EXPEDITION_WAYPOINT_WAYPOINT_ID_FKEY);
    table.jsonb('meta').notNullable().defaultTo('{}');
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());

    table.unique(['expeditionId', 'waypointId'], {
      indexName: DatabaseConstraints.EXPEDITION_WAYPOINT_PKEY,
    });
  });
}
